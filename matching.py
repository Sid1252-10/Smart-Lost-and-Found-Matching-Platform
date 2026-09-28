from datetime import datetime


# ==========================================
# ITEM NAME SCORE
# Maximum: 20 points
# ==========================================

def name_score(lost_name, found_name):

    lost_name = lost_name.lower().strip()
    found_name = found_name.lower().strip()

    # Exact match
    if lost_name == found_name:
        return 20

    # One name contains the other
    if lost_name in found_name or found_name in lost_name:
        return 17

    # Related item words
    related_items = {

        "sword": [
            "katana",
            "blade",
            "weapon"
        ],

        "katana": [
            "sword",
            "blade",
            "weapon"
        ],

        "blade": [
            "sword",
            "katana",
            "weapon"
        ],

        "weapon": [
            "sword",
            "katana",
            "blade"
        ],

        "phone": [
            "mobile",
            "smartphone"
        ],

        "mobile": [
            "phone",
            "smartphone"
        ],

        "smartphone": [
            "phone",
            "mobile"
        ],

        "wallet": [
            "purse"
        ],

        "purse": [
            "wallet"
        ],

        "bag": [
            "backpack",
            "luggage"
        ],

        "backpack": [
            "bag",
            "luggage"
        ],

        "luggage": [
            "bag",
            "backpack"
        ],

        "hat": [
            "cap"
        ],

        "cap": [
            "hat"
        ]
    }

    # Check related words
    for word, related_words in related_items.items():

        if word in lost_name:

            for related_word in related_words:

                if related_word in found_name:
                    return 14

        if word in found_name:

            for related_word in related_words:

                if related_word in lost_name:
                    return 14

    # Check common words
    lost_words = set(lost_name.split())
    found_words = set(found_name.split())

    common_words = lost_words.intersection(found_words)

    if common_words:
        return 10

    return 0


# ==========================================
# CATEGORY SCORE
# Maximum: 25 points
# ==========================================

def category_score(lost_category, found_category):

    lost_category = lost_category.lower().strip()
    found_category = found_category.lower().strip()

    if lost_category == found_category:
        return 25

    return 0


# ==========================================
# DESCRIPTION SCORE
# Maximum: 30 points
# ==========================================

def description_score(
    lost_description,
    found_description
):

    lost_words = set(
        lost_description.lower().split()
    )

    found_words = set(
        found_description.lower().split()
    )

    if not lost_words or not found_words:
        return 0

    common_words = lost_words.intersection(
        found_words
    )

    similarity = (
        len(common_words)
        /
        max(
            len(lost_words),
            len(found_words)
        )
    )

    score = round(similarity * 30)

    return min(score, 30)


# ==========================================
# LOCATION SCORE
# Maximum: 15 points
# ==========================================

def location_score(
    lost_location,
    found_location
):

    lost_location = lost_location.lower().strip()
    found_location = found_location.lower().strip()

    # Exact location
    if lost_location == found_location:
        return 15

    # Similar location name
    if (
        lost_location in found_location
        or
        found_location in lost_location
    ):
        return 10

    # Check common location words
    lost_words = set(lost_location.split())
    found_words = set(found_location.split())

    if lost_words.intersection(found_words):
        return 7

    return 0


# ==========================================
# DATE SCORE
# Maximum: 10 points
# ==========================================

def date_score(
    lost_date,
    found_date
):

    lost = datetime.strptime(
        lost_date,
        "%Y-%m-%d"
    )

    found = datetime.strptime(
        found_date,
        "%Y-%m-%d"
    )

    difference = abs(
        (lost - found).days
    )

    # Same day
    if difference == 0:
        return 10

    # One day apart
    if difference == 1:
        return 8

    # Within 3 days
    if difference <= 3:
        return 5

    # Within a week
    if difference <= 7:
        return 2

    return 0


# ==========================================
# FINAL MATCH CALCULATION
# Maximum: 100 points
# ==========================================

def calculate_match(lost, found):

    name = name_score(
        lost["item_name"],
        found["item_name"]
    )

    category = category_score(
        lost["category"],
        found["category"]
    )

    description = description_score(
        lost["description"],
        found["description"]
    )

    location = location_score(
        lost["location"],
        found["location"]
    )

    date = date_score(
        lost["report_date"],
        found["report_date"]
    )

    total = (
        name
        + category
        + description
        + location
        + date
    )

    return {
        "name": name,
        "category": category,
        "description": description,
        "location": location,
        "date": date,
        "total": total
    }


# ==========================================
# MATCH LEVEL
# ==========================================

def match_level(score):

    if score >= 80:
        return "Strong Match"

    elif score >= 60:
        return "Possible Match"

    elif score >= 40:
        return "Weak Match"

    else:
        return "Unlikely Match"
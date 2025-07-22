students = [
    {"name": "Alice", "score": 88},
    {"name": "Bob", "score": 95},
    {"name": "Charlie", "score": 82},
]
sorted_students = sorted(students, key=lambda student: student["score"], reverse=True)
print(sorted_students)
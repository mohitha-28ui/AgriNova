import sys
import os
sys.path.insert(0, os.path.abspath("."))
from backend.app.database.mongodb import users_col, admin_users_col

print("=== VERIFYING DATABASE RECORDS ===")
admins = list(users_col.find({"role": "admin"}))
print(f"Total Admin records in users_col: {len(admins)}")
for a in admins:
    print(f"  Email: {a.get('email')}, Name: {a.get('full_name')}, Role: {a.get('role')}")

farmers = list(users_col.find({"role": "farmer"}))
print(f"Total Farmer records in users_col: {len(farmers)}")
for f in farmers:
    print(f"  Email: {f.get('email')}, Name: {f.get('full_name')}, Role: {f.get('role')}")

print("\n=== VERIFYING ADMIN_USERS COLLECTION ===")
admin_entries = list(admin_users_col.find())
print(f"Total records in admin_users_col: {len(admin_entries)}")
for ae in admin_entries:
    print(f"  Email: {ae.get('email')}, Name: {ae.get('full_name')}, Role: {ae.get('role')}")

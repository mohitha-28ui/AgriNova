"""
Update Admin Account in MongoDB to Sana Mohitha
"""
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from backend.app.database.mongodb import users_col, admin_users_col

def update_admin():
    print("--> Updating Admin profile in MongoDB...")
    
    # 1. Update in users_col
    users_col.update_one(
        {"email": "admin@agrinova.ai"},
        {"$set": {"full_name": "Sana Mohitha", "role": "admin"}}
    )
    
    # 2. Update in admin_users_col
    admin_users_col.update_one(
        {"email": "admin@agrinova.ai"},
        {"$set": {"full_name": "Sana Mohitha", "role": "admin"}}
    )
    
    # Verify records
    admin_in_users = users_col.find_one({"email": "admin@agrinova.ai"})
    admin_in_admin = admin_users_col.find_one({"email": "admin@agrinova.ai"})
    farmer_in_users = users_col.find_one({"email": "farmer@agrinova.ai"})
    
    print("\n[VERIFICATION]")
    print(f"Admin in users_col       : {admin_in_users.get('full_name')} ({admin_in_users.get('email')}, Role: {admin_in_users.get('role')})")
    print(f"Admin in admin_users_col : {admin_in_admin.get('full_name')} ({admin_in_admin.get('email')}, Role: {admin_in_admin.get('role')})")
    print(f"Farmer in users_col      : {farmer_in_users.get('full_name')} ({farmer_in_users.get('email')}, Role: {farmer_in_users.get('role')})")
    print("\nTotal accounts in users_col:", users_col.count_documents())
    
    assert admin_in_users.get("full_name") == "Sana Mohitha"
    assert admin_in_admin.get("full_name") == "Sana Mohitha"
    assert admin_in_users.get("role") == "admin"
    print("\n[SUCCESS] Admin user successfully updated to 'Sana Mohitha'!")

if __name__ == "__main__":
    update_admin()

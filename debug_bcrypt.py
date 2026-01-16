from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    print("Hashing 'hassan123'...")
    h = pwd_context.hash("hassan123")
    print(f"Success: {h}")
    
    print("Verifying...")
    v = pwd_context.verify("hassan123", h)
    print(f"Verified: {v}")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

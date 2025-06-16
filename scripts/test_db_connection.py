import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os

# Proje kök dizinini Python yoluna ekle
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

from backend.app.config import settings

async def check_db_connection():
    """Veritabanı bağlantısını kontrol eder."""
    print(f"MongoDB URL: {settings.MONGODB_URL}")
    print(f"Database Name: {settings.DATABASE_NAME}")
    client = None  # client değişkenini başlangıçta None olarak ayarlayın
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        # Bağlantıyı doğrulamak için sunucu bilgilerini almayı deneyin
        await client.server_info()
        print("Veritabanı bağlantısı başarılı!")

        # İsteğe bağlı: Veritabanındaki koleksiyonları listele
        # db = client[settings.DATABASE_NAME]
        # collections = await db.list_collection_names()
        # print(f"'{settings.DATABASE_NAME}' veritabanındaki koleksiyonlar: {collections}")

    except Exception as e:
        print(f"Veritabanı bağlantısı başarısız: {e}")
    finally:
        if client:
            client.close()
            print("Veritabanı bağlantısı kapatıldı.")

if __name__ == "__main__":
    asyncio.run(check_db_connection())

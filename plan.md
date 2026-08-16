Projemiz Discord botu üzerinden temp mail hizmeti veren bir discord botu yapmak.

Döküman için https://catchmail.io/docs burayı okuyabilirsin 

/slash komutları ile çalışacak ve embed tasarımı güzel olması gerekiyor. 

admin slash komutları da eklemen gerekiyor. custom domain falan ekleyebilelim ve daha fazlası 

**ÖNEMLİ ÖZELLİKLER:**
- **Çoklu Dil Desteği (i18n):** Bot tüm dilleri desteklemelidir. Kullanıcının Discord dil ayarına göre otomatik olarak aşağıdaki dillerde (ve daha fazlasında) hizmet vermelidir:
  - 🇹🇷 Türkçe (tr)
  - 🇬🇧 İngilizce (en)
  - 🇩🇪 Almanca (de)
  - 🇫🇷 Fransızca (fr)
  - 🇪🇸 İspanyolca (es)
  - 🇮🇹 İtalyanca (it)
  - 🇵🇹 Portekizce (pt)
  - 🇷🇺 Rusça (ru)
  - 🇯🇵 Japonca (ja)
  - 🇰🇷 Korece (ko)
  - 🇨🇳 Çince (zh-CN)
  - 🇸🇦 Arapça (ar)
  - Ve diğer tüm Discord tarafından desteklenen diller
  
- Dil dosyaları modüler yapıda olacak (`locales/tr.json`, `locales/en.json`, vb.)
- Yeni dil eklemek kolay olmalı
- Adminler sunucu bazlı varsayılan dil ayarlayabilmeli

**TEKNİK YIĞIN:**
- Runtime: Node.js (v18+)
- Framework: discord.js (v14+)
- Dil Yönetimi: i18next veya benzeri kütüphane
- Veritabanı: MongoDB veya PostgreSQL
- API Entegrasyonu: CatchMail.io API

# Park App

Park App adalah aplikasi sistem parkir yang dibangun menggunakan Bun sebagai runtime dan Elysia.js sebagai library. Aplikasi ini memungkinkan pengelolaan parkir mobil dengan fitur registrasi kendaraan, perhitungan biaya parkir, dan laporan jumlah mobil berdasarkan tipe dan warna.

## Teknologi yang Digunakan

- **Runtime**: [Bun](https://bun.sh/)
- **Library**: [Elysia.js](https://elysiajs.com/)

## Instalasi

1. **Clone Repository**

   ```bash
   git clone https://github.com/nyxsr/park-app.git
   cd park-app
   bun install
   bun dev
   ```

2. Jalankan via Docker

    Sebelum melakukan hal ini, pastikan anda memiliki docker di local machine anda.

    Anda bisa menjalankan

    ```bash
    cd park-app
    docker build -t park-app
    ```

    Setelah image terbentuk, maka tinggal menjalankan image tersebut sebagai container

    ```bash
    docker run -d -p 3000:3000 park-app
    ```

Anda bisa mengaksesnya di <http://localhost:3000>

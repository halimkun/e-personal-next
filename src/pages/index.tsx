import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  // Gunakan useEffect untuk menjalankan pengalihan setelah komponen dipasang
  useEffect(() => {
    // Lakukan pengalihan ke "/dashboard"
    router.push("/dashboard");
  }, []); // Pastikan untuk memberikan array dependensi kosong agar efek hanya dijalankan sekali setelah pemasangan komponen

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}

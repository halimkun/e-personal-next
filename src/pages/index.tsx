import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Loading1 = dynamic(() => import('@/components/custom/icon-loading'), { ssr: false });

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="h-screen w-screen">
      <Loading1 alignItem='center'/>
    </div>
  );
}

import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button"
import { IconLogout } from "@tabler/icons-react";

type LogoutButtonProps = {
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  title?: string
}

export const LogoutButton = ({ 
  className = '',
  variant = 'destructive',
  size = 'icon',
  title = "Logout from the application"
}: LogoutButtonProps) => {
  const router = useRouter();
  const handleSignOut = async () => {
    const sesstion = await getSession();
    const confirm = window.confirm('Are you sure you want to log out?');

    if (confirm) {
      // unauthenticate user from api
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sesstion?.rsiap?.access_token}`
        }
      });

      const data = await res.json();
      if (data?.success) {
        // unauthenticate user from next-auth
        await signOut();
        toast.success(data?.message);

        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        toast.error(data?.message);
      }
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleSignOut} title={title}>
      <IconLogout className="w-5 h-5" />
    </Button>
  )
}
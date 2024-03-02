import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react";

import { IconInnerShadowTop } from "@tabler/icons-react"
import { useRouter } from "next/router"
import toast from "react-hot-toast"


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const [isDisabled, setIsDisabled] = React.useState<boolean>(false)
	const router = useRouter();

	async function onSubmit(event: React.SyntheticEvent) {
		event.preventDefault()
		setIsDisabled(true)

		// log value from input
		const username = (event.target as any).username.value
		const password = (event.target as any).password.value

		const callbackUrl = router.query.callbackUrl as string || '/dashboard'

		toast.promise(
			signIn("credentials", {
				redirect: false,
				username: username,
				password: password,
				callbackUrl: callbackUrl,
			}).then(async (res) => {
				await new Promise((resolve) => setTimeout(resolve, 1500)); // <---- fake loading
				if (res?.ok) {
					return res?.status;
				} else {
					throw new Error(res?.error || "Failed to sign in");
				}
			}).catch((error) => {
				throw error;
			}),
			{
				loading: "Signing in...",
				success: (status) => {
					setIsDisabled(false);
					
					router.push(callbackUrl);
					return "Redirecting...";
				},
				error: (error) => {
					setIsDisabled(false);
					return error instanceof Error ? error.message : "Failed to sign in";
				},
			}
		);
	};

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form method="POST" onSubmit={onSubmit}>
				<div className="grid gap-2">
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="username">
							Username
						</Label>
						<Input
							id="username"
							placeholder="username*"
							type="username"
							autoCapitalize="none"
							autoComplete="username"
							autoCorrect="off"
							required
							disabled={isDisabled}
						/>
					</div>
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="password">
							Password
						</Label>
						<Input
							id="password"
							placeholder="password*"
							type="password"
							autoCapitalize="none"
							autoComplete="password"
							autoCorrect="off"
							required
							disabled={isDisabled}
						/>
					</div>
					<div className="mt-4 w-full">
						<Button variant="default" disabled={isDisabled} className="w-full">
							{isDisabled && (
								<IconInnerShadowTop className="mr-2 h-4 w-4 animate-spin" />
							)}
							Sign In
						</Button>
					</div>
				</div>
			</form>
		</div>
	)
}
import Dashboard from "@/components/pages/dashboard";
import { SpendAndSave } from "@/components/SpendAndSave";

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
			<SpendAndSave />
		</div>
	);
}

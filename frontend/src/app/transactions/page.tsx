"use client";

import {useAccount, useReadContract} from "wagmi";
import {SPEND_AND_SAVE_ABI} from "../abi";
import {formatEther} from "viem";
import Link from "next/link";

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
	"0x0000000000000000000000000000000000000000") as `0x${string}`;

interface Transaction {
	sender: string;
	recipient: string;
	amountSent: bigint;
	amountSaved: bigint;
	timestamp: bigint;
	savingsRateBps: bigint;
}

export default function TransactionsPage() {
	const {address, isConnected} = useAccount();

	const {data: transactions} = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: SPEND_AND_SAVE_ABI,
		functionName: "getUserTransactions",
		args: address ? [address] : undefined,
		query: {
			enabled: !!address,
		},
	}) as {data: Transaction[] | undefined};

	if (!isConnected) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
				<h1 className="text-2xl font-bold mb-4 text-gray-900">
					Transaction History
				</h1>
				<p className="text-gray-600 mb-6">
					Please connect your wallet to view transactions
				</p>
				<Link
					href="/"
					className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				>
					Go Home
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4 md:p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-gray-900">
						Transaction History
					</h1>
					<Link
						href="/"
						className="text-blue-600 hover:text-blue-700 text-sm font-medium"
					>
						← Back to Home
					</Link>
				</div>

				{!transactions || transactions.length === 0 ? (
					<div className="bg-white rounded-xl shadow-sm p-12 text-center">
						<div className="text-5xl mb-4">📭</div>
						<p className="text-gray-600 text-lg">
							No transactions yet
						</p>
						<p className="text-gray-400 text-sm mt-2">
							Your send money transactions will appear here
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{[...transactions].reverse().map((tx, index) => (
							<div
								key={index}
								className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
												<span className="text-green-600 text-lg">
													↗
												</span>
											</div>
											<div>
												<p className="font-semibold text-gray-900">
													Sent Money
												</p>
												<p className="text-xs text-gray-500">
													{new Date(
														Number(tx.timestamp) *
															1000
													).toLocaleString()}
												</p>
											</div>
										</div>

										<div className="ml-12 space-y-1">
											<div className="flex items-center justify-between">
												<span className="text-sm text-gray-600">
													To:
												</span>
												<span className="text-sm font-mono text-gray-900">
													{tx.recipient.slice(0, 6)}
													...{tx.recipient.slice(-4)}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-gray-600">
													Amount Sent:
												</span>
												<span className="text-sm font-semibold text-gray-900">
													{parseFloat(
														formatEther(
															tx.amountSent
														)
													).toFixed(4)}{" "}
													CELO
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-gray-600">
													Auto-Saved:
												</span>
												<span className="text-sm font-semibold text-green-600">
													+
													{parseFloat(
														formatEther(
															tx.amountSaved
														)
													).toFixed(4)}{" "}
													CELO
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-gray-600">
													Savings Rate:
												</span>
												<span className="text-sm text-gray-700">
													{Number(tx.savingsRateBps) /
														100}
													%
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const SPEND_AND_SAVE_ABI = [
	{
		type: "constructor",
		inputs: [
			{
				name: "_defaultSavingsRateBps",
				type: "uint256",
				internalType: "uint256",
			},
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "defaultSavingsRateBps",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getContractBalance",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getUserData",
		inputs: [
			{
				name: "account",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [
			{
				name: "totalSpent",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "totalSaved",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "effectiveRateBps",
				type: "uint256",
				internalType: "uint256",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getUserTransactionCount",
		inputs: [
			{
				name: "user",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getUserTransactions",
		inputs: [
			{
				name: "user",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [
			{
				name: "",
				type: "tuple[]",
				internalType: "struct SpendAndSaveV1.Transaction[]",
				components: [
					{
						name: "sender",
						type: "address",
						internalType: "address",
					},
					{
						name: "recipient",
						type: "address",
						internalType: "address",
					},
					{
						name: "amountSent",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "amountSaved",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "timestamp",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "savingsRateBps",
						type: "uint256",
						internalType: "uint256",
					},
				],
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "owner",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "renounceOwnership",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "setDefaultSavingsRate",
		inputs: [
			{
				name: "newRateBps",
				type: "uint256",
				internalType: "uint256",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "setSavingsRate",
		inputs: [
			{
				name: "newRateBps",
				type: "uint256",
				internalType: "uint256",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "spendAndSave",
		inputs: [
			{
				name: "recipient",
				type: "address",
				internalType: "address payable",
			},
		],
		outputs: [],
		stateMutability: "payable",
	},
	{
		type: "function",
		name: "transferOwnership",
		inputs: [
			{
				name: "newOwner",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "userTransactions",
		inputs: [
			{
				name: "",
				type: "address",
				internalType: "address",
			},
			{
				name: "",
				type: "uint256",
				internalType: "uint256",
			},
		],
		outputs: [
			{
				name: "sender",
				type: "address",
				internalType: "address",
			},
			{
				name: "recipient",
				type: "address",
				internalType: "address",
			},
			{
				name: "amountSent",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "amountSaved",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "timestamp",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "savingsRateBps",
				type: "uint256",
				internalType: "uint256",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "users",
		inputs: [
			{
				name: "",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [
			{
				name: "totalSpent",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "totalSaved",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "savingsRateBps",
				type: "uint256",
				internalType: "uint256",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "withdrawSavings",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "event",
		name: "DefaultSavingsRateUpdated",
		inputs: [
			{
				name: "newRateBps",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "OwnershipTransferred",
		inputs: [
			{
				name: "previousOwner",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "newOwner",
				type: "address",
				indexed: true,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "SavingsWithdrawn",
		inputs: [
			{
				name: "user",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "amount",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "SpentAndSaved",
		inputs: [
			{
				name: "sender",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "recipient",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "amountSent",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "amountSaved",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "effectiveRateBps",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "timestamp",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "UserSavingsRateUpdated",
		inputs: [
			{
				name: "user",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "newRateBps",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "error",
		name: "OwnableInvalidOwner",
		inputs: [
			{
				name: "owner",
				type: "address",
				internalType: "address",
			},
		],
	},
	{
		type: "error",
		name: "OwnableUnauthorizedAccount",
		inputs: [
			{
				name: "account",
				type: "address",
				internalType: "address",
			},
		],
	},
	{
		type: "error",
		name: "ReentrancyGuardReentrantCall",
		inputs: [],
	},
] as const;

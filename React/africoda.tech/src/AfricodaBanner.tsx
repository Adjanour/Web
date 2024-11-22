import React, { useState, useEffect } from "react";
import "./Africoda.css";

// List of quotes
const quotes = [
	// Programming and Technology Quotes
	"Code is like humor. When you have to explain it, it’s bad.",
	"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
	"First, solve the problem. Then, write the code.",
	"Experience is the name everyone gives to their mistakes.",
	"In order to be irreplaceable, one must always be different.",
	"Java is to JavaScript what car is to Carpet.",
	"Simplicity is the soul of efficiency.",
	"Programs must be written for people to read, and only incidentally for machines to execute.",
	"Talk is cheap. Show me the code.",
	"Premature optimization is the root of all evil.",
	"It’s not a bug. It’s an undocumented feature.",
	"Testing leads to failure, and failure leads to understanding.",
	"Knowledge is power, but enthusiasm pulls the switch.",

	// Personal Development and Leadership
	"Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
	"The only way to do great work is to love what you do.",
	"Leadership is not about being in charge. It’s about taking care of those in your charge.",
	"Your limitation—it’s only your imagination.",
	"Dream big and dare to fail.",
	"Success is walking from failure to failure with no loss of enthusiasm.",
	"Don’t watch the clock; do what it does. Keep going.",
	"The only place where success comes before work is in the dictionary.",
	"Your most unhappy customers are your greatest source of learning.",
	"Don’t be afraid to give up the good to go for the great.",
	"Leadership is the capacity to translate vision into reality.",

	// Creativity and Innovation
	"Creativity is intelligence having fun.",
	"Imagination is more important than knowledge. Knowledge is limited; imagination encircles the world.",
	"An essential aspect of creativity is not being afraid to fail.",
	"Don’t worry about people stealing your design work. Worry about the day they stop.",
	"Innovation distinguishes between a leader and a follower.",
	"Good artists copy, great artists steal.",
	"You can't use up creativity. The more you use, the more you have.",
	"The best way to predict the future is to invent it.",

	// Productivity and Focus
	"Do not wait to strike till the iron is hot; but make it hot by striking.",
	"Focus on being productive instead of busy.",
	"The way to get started is to quit talking and begin doing.",
	"Your time is limited, don’t waste it living someone else’s life.",
	"Don’t count the days, make the days count.",
	"Small daily improvements are the key to staggering long-term results.",
	"Time blocking is the key to maximizing your focus and energy.",
	"Deep work is the ability to focus without distraction on a cognitively demanding task.",

	// Pan-Africanism and Social Development
	"Africa’s story has been written by others; we need to own our problems and solutions and write our story.",
	"Let us work together in unity to make Africa a place of prosperity, freedom, and hope.",
	"True Pan-Africanism is about African unity and self-reliance.",
	"The people who are crazy enough to think they can change the world are the ones who do.",
	"Education is the most powerful weapon which you can use to change the world.",
	"It is not our differences that divide us. It is our inability to recognize, accept, and celebrate those differences.",

	// General Wisdom and Life Advice
	"Life is 10% what happens to us and 90% how we react to it.",
	"It’s not whether you get knocked down, it’s whether you get up.",
	"The biggest risk is not taking any risk.",
	"It does not matter how slowly you go as long as you do not stop.",
	"Do not go where the path may lead, go instead where there is no path and leave a trail.",
	"Be the change that you wish to see in the world.",
	"The journey of a thousand miles begins with one step.",
	"Strive not to be a success, but rather to be of value.",
];

// Theme options (colors and styles)
const themes = [
	// Existing Themes
	{ bg: "from-purple-800 via-blue-500 to-teal-500", text: "text-white" },
	{ bg: "from-yellow-400 via-red-500 to-pink-500", text: "text-black" },
	{ bg: "from-green-700 via-teal-400 to-blue-600", text: "text-gray-100" },
	{ bg: "from-gray-900 via-purple-900 to-violet-600", text: "text-white" },

	// New Themes
	{
		bg: "from-indigo-700 via-purple-500 to-pink-400",
		text: "text-yellow-100",
	},
	{ bg: "from-blue-900 via-cyan-700 to-green-500", text: "text-white" },
	{ bg: "from-orange-400 via-red-400 to-purple-600", text: "text-gray-900" },
	{ bg: "from-red-500 via-yellow-400 to-green-500", text: "text-white" },
	{ bg: "from-blue-300 via-teal-200 to-indigo-400", text: "text-gray-900" },
	{ bg: "from-emerald-500 via-teal-400 to-lime-300", text: "text-white" },
	{ bg: "from-fuchsia-700 via-red-500 to-yellow-400", text: "text-white" },
	{ bg: "from-gray-800 via-blue-800 to-indigo-900", text: "text-gray-200" },
	{ bg: "from-teal-500 via-green-400 to-cyan-300", text: "text-black" },
	{ bg: "from-yellow-600 via-orange-500 to-red-500", text: "text-gray-100" },
	{ bg: "from-cyan-500 via-sky-400 to-blue-500", text: "text-gray-900" },
	{ bg: "from-pink-700 via-rose-500 to-red-400", text: "text-gray-100" },
	{ bg: "from-blue-800 via-violet-600 to-purple-500", text: "text-white" },
	{ bg: "from-slate-800 via-gray-700 to-slate-500", text: "text-gray-100" },
];

// Function to generate hash using Web Crypto API
const generateHash = async (data: string) => {
	const encoder = new TextEncoder();
	const dataBuffer = encoder.encode(data);
	const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);

	// Convert the hash to a hexadecimal string
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
};

const AfricodaBanner: React.FC = () => {
	const [isHovered, setIsHovered] = useState(false);
	const [quote, setQuote] = useState("");
	const [theme, setTheme] = useState(themes[0]);

	// Get user details (user agent and some random number or timestamp)
	const getUserDetails = () => {
		const userAgent = navigator.userAgent; // Get browser user agent
		const randomNum = Math.random().toString(); // Add some randomness or use a timestamp
		return `${userAgent}${randomNum}`;
	};

	// Convert hash to a numeric value
	const hashToNumber = (hash: string) => {
		let num = 0;
		for (let i = 0; i < hash.length; i++) {
			num += hash.charCodeAt(i);
		}
		return num;
	};

	// Function to get a quote and theme based on the hash
	const getUserQuoteAndTheme = async () => {
		const userDetails = getUserDetails();
		const userHash = await generateHash(userDetails);
		const numericHash = hashToNumber(userHash);

		// Get quote based on hash
		const quoteIndex = numericHash % quotes.length;

		// Get theme based on hash
		const themeIndex = numericHash % themes.length;

		return { quote: quotes[quoteIndex], theme: themes[themeIndex] };
	};

	useEffect(() => {
		const fetchQuoteAndTheme = async () => {
			const { quote, theme } = await getUserQuoteAndTheme();
			setQuote(quote);
			setTheme(theme);
		};

		fetchQuoteAndTheme();
	}, []);

	return (
		<div
			className={`bg-gradient-to-r ${theme.bg} h-screen flex items-center justify-center ${theme.text}`}
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				marginTop: "0",
				width: "100%",
				height: "100vh",
			}}
		>
			<div className="text-center p-10">
				<h1
					className={`banner-title text-4xl font-serif sm:text-6xl font-bold mb-4 transition-transform duration-300 ${
						isHovered ? "scale-110" : "scale-100"
					}`}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					Africoda
				</h1>
				<p className="banner-quote text-xl sm:text-2xl font-light italic">
					{quote}
				</p>
			</div>
		</div>
	);
};

export default AfricodaBanner;

import { useState, useEffect } from "react";
import stayImage from "./assets/fin.jpg"; // Make sure the image is in src/assets/

// Mock Data
const countries = {
  USA: Array.from({ length: 9 }, (_, i) => `+1 202-555-01${i.toString().padStart(2, "0")}`),
  Canada: Array.from({ length: 9 }, (_, i) => `+1 416-555-01${i.toString().padStart(2, "0")}`),
  Australia: Array.from({ length: 9 }, (_, i) => `+61 2 5550 ${1000 + i}`),
  Netherlands: Array.from({ length: 9 }, (_, i) => `+31 20 555 0${100 + i}`),
};

const plans = [
  {
    name: "Basic",
    price: "$5/month",
    details: "Includes calls + SMS. Best for personal use.",
  },
  {
    name: "Premium",
    price: "$10/month",
    details: "Calls + SMS + Voicemail + Extra features. Great for business.",
  },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState("home"); // "home" | "about" | "connect"
  const [step, setStep] = useState(0); // 0..5 (0 = landing)
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [plan, setPlan] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    // payment fields will be added on the fly (cardName, cardNumber, expiry, cvc)
  });
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Splash timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Apply dark mode class to <html>
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Splash screen
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <img
          src={stayImage}
          alt="Splash"
          className="w-full h-[80vh] md:h-full object-cover sm:object-top"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white text-center transition-transform duration-300 hover:scale-105 hover:text-green-400 px-4"
            style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "1px" }}
          >
            Welcome to COOEE
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col relative transition`}>
      {/* Fixed background image */}
      <div className="fixed inset-0 -z-20">
        <img src={stayImage} alt="Cooee Virtual Communication" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 ${darkMode ? "bg-black/40" : "bg-black/30"} backdrop-blur-sm`} />
      </div>

      {/* Navbar */}
      <nav
        className={`flex items-center justify-between px-6 py-4 relative z-20 backdrop-blur-md ${
          darkMode ? "bg-gray-800/80" : "bg-gray-900/75"
        }`}
      >
        <div className="flex items-center gap-6">
          <h1
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={() => {
              setPage("home");
              setStep(0);
            }}
          >
            Cooee
          </h1>

          <div className="hidden md:flex gap-4 text-white">
            <button
              onClick={() => {
                setPage("home");
                setStep(0);
              }}
              className="hover:underline"
            >
              Home
            </button>
            <button onClick={() => setPage("about")} className="hover:underline">About</button>
            <button onClick={() => setPage("connect")} className="hover:underline">Stay Connected</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-white text-sm hidden sm:block mr-2">Theme</div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg border border-gray-600 text-sm bg-gray-800/60 hover:bg-gray-700 text-white backdrop-blur"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>

      {/* Main container */}
      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div
          className={`shadow-xl rounded-2xl w-full max-w-3xl p-8 transition backdrop-blur-md ${
            darkMode ? "bg-gray-900/90 text-white" : "bg-white/70 text-gray-900"
          }`}
        >
          {/* HOME (flow) */}
          {page === "home" && (
            <>
              {/* Stepper: only visible after landing (step >= 1) */}
              {step >= 1 && (
                <div className="flex justify-between items-center mb-8">
                  {["Country", "Plan", "Register", "Payment", "Confirm"].map((label, index) => {
                    const stepNumber = index + 1; // 1..5
                    // Completed: previous steps, or if on final confirmation mark it completed too
                    const isCompleted = step > stepNumber || (step === 5 && stepNumber === 5);
                    const isActive = step === stepNumber && !isCompleted;

                    return (
                      <div key={label} className="flex-1 flex flex-col items-center relative">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition
                            ${
                              isCompleted
                                ? "bg-gray-700 border-gray-700 text-white" // completed -> tick
                                : isActive
                                ? "bg-gray-500 border-gray-500 text-white" // active -> number
                                : "bg-gray-400 border-gray-400 text-white" // upcoming -> number
                            }`}
                        >
                          {isCompleted ? "✓" : stepNumber}
                        </div>

                        <p
                          className={`mt-2 text-sm font-medium transition ${
                            isActive ? "text-gray-600" : isCompleted ? "text-gray-700" : "text-gray-400"
                          }`}
                        >
                          {label}
                        </p>

                        {/* Connector */}
                        {index < 4 && (
                          <div
                            className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 transition ${
                              step > stepNumber ? "bg-gray-700" : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Step 0: Landing */}
              {step === 0 && (
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                    Connect Anywhere, Anytime — <span className="text-green-400">Beyond SIMs</span>
                  </h1>
                  <p className="text-lg md:text-xl mb-6">
                    Travel, work, or study abroad with ease. Cooee gives you instant mobile numbers and affordable calling plans — no SIM, no stress.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-8 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 transition text-black shadow-lg"
                    >
                      Buy Mobile Number →
                    </button>
                    <button
                      onClick={() => { setPage("about"); }}
                      className="px-6 py-3 rounded-lg font-semibold bg-white/60 hover:bg-white/80 transition text-gray-900"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              )}

              {/* Step 1: Country + Number selection */}
              {step === 1 && (
                <div>
                  <h1 className="text-2xl font-bold mb-6 text-center">Select Your Virtual Number</h1>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {Object.keys(countries).map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          setSelectedCountry(country);
                          setSelectedNumber("");
                        }}
                        className={`p-4 border rounded-lg font-semibold transition ${
                          selectedCountry === country
                            ? darkMode
                              ? "bg-gray-700 text-white"
                              : "bg-gray-400 text-black"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>

                  {selectedCountry && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Available Numbers in {selectedCountry}</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                        {countries[selectedCountry].map((num) => (
                          <button
                            key={num}
                            onClick={() => setSelectedNumber(num)}
                            className={`p-2 border rounded-lg text-sm transition ${
                              selectedNumber === num
                                ? darkMode
                                  ? "bg-gray-700 text-white"
                                  : "bg-gray-400 text-black"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => { setStep(0); setSelectedCountry(""); setSelectedNumber(""); }}
                      className="w-1/2 p-3 rounded-lg font-semibold bg-gray-200 text-black hover:bg-gray-300"
                    >
                      Back
                    </button>
                    <button
                      disabled={!selectedNumber}
                      onClick={() => setStep(2)}
                      className={`w-1/2 p-3 rounded-lg font-semibold ${
                        selectedNumber
                          ? darkMode
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-gray-400 text-black hover:bg-gray-500"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Plan selection */}
              {step === 2 && (
                <div>
                  <h1 className="text-2xl font-bold mb-6 text-center">Choose a Subscription Plan</h1>
                  <p className="text-center mb-4">Selected Number: <strong>{selectedNumber}</strong></p>
                  <div className="grid gap-4">
                    {plans.map((p) => (
                      <div
                        key={p.name}
                        onClick={() => setPlan(p.name)}
                        className={`border rounded-xl p-4 cursor-pointer transition ${
                          plan === p.name
                            ? darkMode
                              ? "bg-gray-700 text-white"
                              : "bg-gray-400 text-black"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <h2 className="text-xl font-bold">{p.name} Plan</h2>
                        <p className="text-sm mt-1">{p.price}</p>
                        <p className="text-sm mt-2">{p.details}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/2 p-3 rounded-lg font-semibold bg-gray-200 text-black hover:bg-gray-300"
                    >
                      Back
                    </button>
                    <button
                      disabled={!plan}
                      onClick={() => setStep(3)}
                      className={`w-1/2 p-3 rounded-lg font-semibold ${
                        plan
                          ? darkMode
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-gray-400 text-black hover:bg-gray-500"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Registration */}
              {step === 3 && (
                <div>
                  <h1 className="text-2xl font-bold mb-6 text-center">Register Your Details</h1>
                  <div className="grid gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="border p-2 rounded-lg w-full dark:bg-gray-700"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="border p-2 rounded-lg w-full dark:bg-gray-700"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                      className="border p-2 rounded-lg w-full dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Address (optional)"
                      value={user.address}
                      onChange={(e) => setUser({ ...user, address: e.target.value })}
                      className="border p-2 rounded-lg w-full dark:bg-gray-700"
                    />
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setStep(2)}
                      className="w-1/2 p-3 rounded-lg font-semibold bg-gray-200 text-black hover:bg-gray-300"
                    >
                      Back
                    </button>
                    <button
                      disabled={!user.name || !user.email || !user.password}
                      onClick={() => setStep(4)}
                      className={`w-1/2 p-3 rounded-lg font-semibold ${
                        user.name && user.email && user.password
                          ? darkMode
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-gray-400 text-black hover:bg-gray-500"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {step === 4 && (
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-6">Payment</h1>
                  <p className="mb-4">Selected Plan: <strong>{plan}</strong></p>

                  {!paymentSuccess && (
                    <div className="max-w-md mx-auto text-left grid gap-4">
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={user.cardName || ""}
                        onChange={(e) => setUser({ ...user, cardName: e.target.value })}
                        className="border p-2 rounded-lg w-full dark:bg-gray-700"
                      />
                      <input
                        type="text"
                        placeholder="Card Number (xxxx xxxx xxxx xxxx)"
                        value={user.cardNumber || ""}
                        onChange={(e) => {
                          // format with spaces for readability (optional)
                          const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                          const spaced = raw.replace(/(.{4})/g, "$1 ").trim();
                          setUser({ ...user, cardNumber: spaced });
                        }}
                        maxLength={19}
                        className="border p-2 rounded-lg w-full dark:bg-gray-700"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Expiry (MM/YY)"
                          value={user.expiry || ""}
                          onChange={(e) => setUser({ ...user, expiry: e.target.value })}
                          maxLength={5}
                          className="border p-2 rounded-lg w-full dark:bg-gray-700"
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          value={user.cvc || ""}
                          onChange={(e) => setUser({ ...user, cvc: e.target.value })}
                          maxLength={4}
                          className="border p-2 rounded-lg w-full dark:bg-gray-700"
                        />
                      </div>

                      <div className="flex gap-4 justify-center mt-4">
                        <button
                          onClick={() => setStep(3)}
                          className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-black hover:bg-gray-300"
                        >
                          Back
                        </button>
                        <button
                          disabled={
                            !user.cardName ||
                            !user.cardNumber ||
                            !user.expiry ||
                            !user.cvc
                          }
                          onClick={() => {
                            setIsPaying(true);
                            setTimeout(() => {
                              setIsPaying(false);
                              setPaymentSuccess(true);
                              setStep(5); // go to confirmation and mark final step
                            }, 1600);
                          }}
                          className={`px-6 py-3 rounded-lg font-semibold text-white ${
                            user.cardName && user.cardNumber && user.expiry && user.cvc
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-300 cursor-not-allowed"
                          }`}
                        >
                          Pay Now
                        </button>
                      </div>

                      {isPaying && <p className="text-blue-600 mt-2">Processing payment...</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Confirmation */}
              {step === 5 && (
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">🎉 Confirmation</h1>
                  <p className="mb-2">Thank you, <strong>{user.name || "User"}</strong>!</p>
                  <p className="mb-2">Your virtual number <strong>{selectedNumber}</strong> is now active.</p>
                  <p className="mb-2">Plan: <strong>{plan}</strong></p>
                  <p className="text-green-600 font-semibold mb-6">Activated Successfully ✅</p>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        // Reset for a fresh flow but keep user on landing
                        setStep(0);
                        setSelectedCountry("");
                        setSelectedNumber("");
                        setPlan("");
                        setUser({ name: "", email: "", password: "", address: "" });
                        setIsPaying(false);
                        setPaymentSuccess(false);
                      }}
                      className="bg-gray-300 text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-400"
                    >
                      Go Home
                    </button>

                    <button
                      onClick={() => {
                        // Stay on confirm but also let user view about or share etc.
                        setPage("connect");
                      }}
                      className="bg-white/70 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-white/90"
                    >
                      Stay Connected
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ABOUT page */}
          {page === "about" && (
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold">About Cooee</h1>
              <p className="text-lg">
                Cooee is your digital communication companion. We remove the need for physical SIM
                cards by offering instant virtual numbers in multiple countries. Whether you’re
                traveling, working abroad, or managing global teams, Cooee keeps you connected
                effortlessly and affordably.
              </p>
              <p className="text-md text-gray-500 dark:text-gray-400">
                Secure. Flexible. Borderless.
              </p>
              <div className="flex justify-center mt-4 gap-4">
                <button
                  onClick={() => { setPage("home"); setStep(0); }}
                  className="px-6 py-3 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-600"
                >
                  Get Started
                </button>
                <button
                  onClick={() => setPage("connect")}
                  className="px-6 py-3 rounded-lg bg-white/60 text-gray-900 font-semibold hover:bg-white/80"
                >
                  Contact Us
                </button>
              </div>
            </div>
          )}

          {/* STAY CONNECTED page */}
          {page === "connect" && (
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold">Stay Connected</h1>
              <p className="text-lg">
                Have questions or need support? We’d love to hear from you. Reach out through our
                channels below:
              </p>

              <ul className="space-y-2 text-md">
                <li>
                  Email:{" "}
                  <a href="#" className="text-green-500 hover:underline">
                    support@cooee.com
                  </a>
                </li>
                <li>
                  Twitter:{" "}
                  <a href="#" className="text-green-500 hover:underline">
                    @CooeeApp
                  </a>
                </li>
                <li>
                  LinkedIn:{" "}
                  <a href="#" className="text-green-500 hover:underline">
                    Cooee
                  </a>
                </li>
              </ul>

              <div className="mt-6">
                <p className="text-sm text-gray-400">
                  Or try the flow again:{" "}
                  <button
                    onClick={() => { setPage("home"); setStep(0); }}
                    className="underline text-white ml-2"
                  >
                    Start over
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
{/* Footer */}
<footer
  className={`text-gray-300 py-3 border-t border-gray-800 backdrop-blur-md ${
    darkMode ? "bg-gray-800" : "bg-gray-900/90"
  }`}
>
  <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
    <p>© {new Date().getFullYear()} Cooee</p>
    <div className="flex gap-4 mt-2 md:mt-0">
      <a href="#" className="hover:text-green-400 transition">Website</a>
      <a href="#" className="hover:text-green-400 transition">LinkedIn</a>
      <a href="#" className="hover:text-green-400 transition">Twitter</a>
    </div>
  </div>
</footer>
    </div>
  );
}
"use client";

export default function CustomerDetails({ customerData, setCustomerData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // MOBILE VALIDATION: Only allow numbers and limit to 10 digits
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 10) {
        setCustomerData({ ...customerData, [name]: onlyNums });
      }
      return;
    }

    setCustomerData({ ...customerData, [name]: value });
  };

  return (
    <section className="bg-transparent space-y-8">
      {/* SECTION HEADER - Cocoa & Gold Style */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-[#2c1810] rounded-xl flex items-center justify-center text-[#bc8a5f] shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-serif italic lowercase tracking-tight text-[#2c1810]">guest profile</h2>
      </div>

      <div className="space-y-6">
        {/* NAME INPUT */}
        <div className="relative">
          <label className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-[#bc8a5f] ml-4 mb-2 block">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g. julian artisan"
            value={customerData.name || ""}
            onChange={handleChange}
            className="w-full p-4 bg-[#fdf8f5] border border-[#bc8a5f]/10 rounded-[1.5rem] text-sm font-sans font-bold text-[#2c1810] outline-none placeholder:text-[#2c1810]/20 focus:border-[#bc8a5f] focus:ring-4 focus:ring-[#bc8a5f]/5 transition-all shadow-sm"
          />
        </div>

        {/* EMAIL INPUT */}
        <div className="relative">
          <label className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-[#bc8a5f] ml-4 mb-2 block">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="lounge@shisha.com"
            value={customerData.email || ""}
            onChange={handleChange}
            required
            className="w-full p-4 bg-[#fdf8f5] border border-[#bc8a5f]/10 rounded-[1.5rem] text-sm font-sans font-bold text-[#2c1810] outline-none placeholder:text-[#2c1810]/20 focus:border-[#bc8a5f] focus:ring-4 focus:ring-[#bc8a5f]/5 transition-all shadow-sm"
          />
        </div>

        {/* PHONE INPUT (10 Digits Only) */}
        <div className="relative">
          <label className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-[#bc8a5f] ml-4 mb-2 block">
            Phone Number (10 Digits)
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="9876543210"
            value={customerData.phone || ""}
            onChange={handleChange}
            className="w-full p-4 bg-[#fdf8f5] border border-[#bc8a5f]/10 rounded-[1.5rem] text-sm font-sans font-bold text-[#2c1810] outline-none placeholder:text-[#2c1810]/20 focus:border-[#bc8a5f] focus:ring-4 focus:ring-[#bc8a5f]/5 transition-all shadow-sm"
          />
          {customerData.phone?.length > 0 && customerData.phone?.length < 10 && (
            <span className="text-[8px] font-black uppercase tracking-widest text-red-400 mt-2 ml-4 block">
              Incomplete Number
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
export default function CareersSection() {
    const languages = [
        ["Spanish", "French"],
        ["Portuguese", "Arabic"],
        ["Dutch", "Hindi"],
        ["Japanese", "Indonesian"],
        ["Korean", "Turkish"],
        ["Mandarin & Cantonese", ""],
        ["German", ""],
    ]

    const locations = [
        { city: "Los Angeles", country: "" },
        { city: "London", country: "" },
        { city: "Dubai", country: "" },
    ]

    return (
        <section className="py-16 px-4 max-w-7xl mt-4 mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                    <span className="text-[#b19b61]">C</span>areers
                </h2>
                <p className="text-gray-700 max-w-3xl mx-auto">
                    We are a dynamic team with a deep passion for exotic and rare vehicles - as well as the thrill for auctions!
                </p>
            </div>

            <div className="max-w-5xl mx-auto">
                <div className=" md:grid md:grid-cols-2">
                    <div className="">
                        <p className="text-lg">
                            Our teams are based in{" "}
                            {locations.map((location, index) => (
                                <span key={location.city}>
                                    <span className="font-semibold">{location.city}</span>
                                    {index < locations.length - 1 ? (index === locations.length - 2 ? " and " : ", ") : ""}
                                </span>
                            ))}{" "}
                            and we're hiring!
                        </p>

                        <p className="text-lg">
                            We also have a number of Car Specialist / Consignment roles currently open, with the following required
                            fluent languages and local market knowledge:
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {languages.map(([left, right], index) => (
                            <ul key={index} className="contents list-disc">
                                <li className="py-2 px-4 bg-gray-50 rounded-md">{left}</li>
                                {right && <li className="py-2 px-4 bg-gray-50 rounded-md">{right}</li>}
                            </ul>
                        ))}
                    </div>
                </div>

                <div className="mt-4 bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-lg">
                        Please email us at{" "}
                        <a href="mailto:careers@carbuydirect.com" className="text-[#b19b61] hover:underline font-semibold">
                            careers@carbuydirect.com
                        </a>{" "}
                        with your CV and cover letter to find out more.
                    </p>
                </div>
            </div>
        </section>
    )
}


export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white text-black px-10 py-10">
      <h1 className="text-4xl font-bold mb-6">BidSense.ai Documentation</h1>

      <p className="text-lg mb-10 max-w-3xl">
        Welcome to BidSense.ai — an AI-powered RFP automation system that helps
        procurement teams create, send, and compare vendor proposals
        effortlessly.  
        This documentation explains how to use each feature in the platform.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl">

        <div className="border rounded-xl p-6 shadow-sm bg-blue-50">
          <h2 className="text-2xl font-semibold mb-3">1. Create RFP</h2>
          <p className="leading-relaxed">
            Describe what you want to procure using natural language.  
            The system converts your description into a structured RFP with:
            <ul className="list-disc ml-5 mt-2">
              <li>Line Items</li>
              <li>Budget</li>
              <li>Delivery timeline</li>
              <li>Payment terms & warranty</li>
            </ul>
            Navigate to <span className="font-medium">RFP → Create RFP</span>.
          </p>
        </div>

        <div className="border rounded-xl p-6 shadow-sm bg-blue-50">
          <h2 className="text-2xl font-semibold mb-3">2. Manage Vendors</h2>
          <p className="leading-relaxed">
            Add, search, and manage vendors with their contact details &
            categories.  
            Navigate to the <span className="font-medium">Vendors</span> page to:
            <ul className="list-disc ml-5 mt-2">
              <li>Add a new vendor</li>
              <li>View all vendors</li>
              <li>Select vendors for an RFP</li>
            </ul>
          </p>
        </div>

        <div className="border rounded-xl p-6 shadow-sm bg-blue-50">
          <h2 className="text-2xl font-semibold mb-3">3. Send RFP</h2>
          <p className="leading-relaxed">
            Choose vendors and send the RFP through email with one click.  
            The email contains RFP details and instructions for response.
            <br />
            Navigate to <span className="font-medium">RFP → View RFP → Select Vendors</span>.
          </p>
        </div>

        <div className="border rounded-xl p-6 shadow-sm bg-blue-50">
          <h2 className="text-2xl font-semibold mb-3">4. Receive Vendor Proposals</h2>
          <p className="leading-relaxed">
            Vendor replies via email with pricing tables, attachments, or
            free-form text.  
            The system automatically interprets the reply and extracts:
            <ul className="list-disc ml-5 mt-2">
              <li>Total price</li>
              <li>Delivery details</li>
              <li>Warranty</li>
              <li>Special conditions</li>
            </ul>
            These appear under each RFP.
          </p>
        </div>

        <div className="border rounded-xl p-6 shadow-sm bg-blue-50 md:col-span-2">
          <h2 className="text-2xl font-semibold mb-3">5. Compare Proposals</h2>
          <p className="leading-relaxed">
            The system generates a comparison between vendors based on:
            <ul className="list-disc ml-5 mt-2">
              <li>Pricing</li>
              <li>Delivery timeline</li>
              <li>Warranty</li>
              <li>Completeness of response</li>
            </ul>
            An AI-generated recommendation summary helps decide:
            <span className="font-medium"> “Which vendor should I choose and why?”</span>
            <br />
            Navigate to: <span className="font-medium">Compare → &lt;RFP&gt;</span>.
          </p>
        </div>

      </div>

      <p className="text-center mt-16 text-gray-700">
        © {new Date().getFullYear()} BidSense.ai — Smart Procurement Automation
      </p>
    </div>
  );
}

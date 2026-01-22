import {createFileRoute} from "@tanstack/react-router";
import {Link} from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    const imageUrl = "public/images/yoga-2.jpg";
    return (
        <div 
            className="min-h-screen overflow-hidden rounded-md text-center m-8 flex flex-col items-center justify-center"
            style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
                height: "80vh",
                borderRadius: "1rem" // Added border radius for rounded edges
            }}
        >
            <div className="p-8 rounded-lg w-2/3">
                <p className="text-4xl font-bold m-4 text-white">Find low-pressure well-being activities near you, and connect with other women in Lahti</p>
                <div className="flex justify-center gap-8 text-xl p-4">
                    <Link to="/activity" className="bg-gray-300 rounded-full px-5 py-2 transition hover:bg-gray-200">
                        Explore
                    </Link>
                    <Link to="/" className="bg-gray-300 rounded-full px-5 py-2 transition hover:bg-gray-200">
                        Community
                    </Link>
                </div>
            </div>
        </div>
    );
}

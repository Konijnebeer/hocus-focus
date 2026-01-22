import {createFileRoute} from "@tanstack/react-router";
import {Link} from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {

    const imageUrl = "image"
    return <div className="min-h-md overflow-hidden rounded-md bg-gray-100 text-center h-screen m-8">
        {imageUrl ? (
            <img
                src={imageUrl}
                alt="Stock Image"
                className="w-full h-64 object-cover"
            />
        ) : (
            <div className="w-full h-64 flex items-center justify-center text-gray-400">
                No image available
            </div>
        )}
        <p className="text-3xl m-4">At vero eos et accusamus.
            et iusto odio dignissimos ducimus qui blanditiis.</p>
        <div className="flex justify-center gap-8 text-xl p-4">
            <Link to="/activity" className="bg-gray-300 rounded-full px-5 py-2 transition hover:bg-gray-200">
                Explore
            </Link>
            <Link to="/" className="bg-gray-300 rounded-full px-5 py-2 transition hover:bg-gray-200">
                Community
            </Link>
        </div>

    </div>;
}

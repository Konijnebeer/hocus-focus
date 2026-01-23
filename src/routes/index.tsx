import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const imageUrl = "public/images/image.png";
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
        borderRadius: "1rem", // Added border radius for rounded edges
      }}
    >
      <div className="p-8 rounded-lg w-2/3">
        <div className="relative m-4">
          <p className="absolute top-1 left-1 text-4xl font-bold text-primary">
            Find low-pressure well-being activities near you, and connect with
            other women in Lahti
          </p>
          <p className="relative text-4xl font-bold text-white">
            Find low-pressure well-being activities near you, and connect with
            other women in Lahti
          </p>
        </div>
        <div className="flex justify-center gap-8 text-xl p-4">
          <Link
            to="/activity"
            className=" text-white bg-primary rounded-full px-5 py-2 transition hover:bg-accent"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
}

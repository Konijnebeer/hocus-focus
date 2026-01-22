import { useState } from 'react';
import { MapPin } from 'lucide-react';

const ActivityDetailPage = () => {
    const [activity] = useState({
        id: '1',
        title: 'Morning Yoga Session',
        category: 'Wellness',
        duration: '60 min',
        numParticipants: 12,
        dateTime: '2026-01-25 at 08:00',
        description: 'Join us for a refreshing morning yoga session to start your day with energy and mindfulness. Suitable for all levels, from beginners to advanced practitioners.',
        location: 'Central Park, New York',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        mapUrl: 'https://www.google.com/maps?q=Central+Park+New+York&output=embed'
    });

    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="w-full md:w-1/3 bg-gray-200 relative">
                        <div className="aspect-square md:aspect-auto md:h-full flex items-center justify-center">
                            {activity.imageUrl ? (
                                <img
                                    src={activity.imageUrl}
                                    alt={activity.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-gray-400">
                                    <svg
                                        className="w-24 h-24"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-2/3 p-6 md:p-8">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {activity.title}
                                </h1>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-3 mb-3">
                                    <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-sm">
                                        {activity.category}
                                    </span>
                                    <span className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded text-sm">
                                        {activity.duration}
                                    </span>
                                    <span className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded text-sm">
                                        {activity.numParticipants} participants
                                    </span>
                                </div>

                                {/* Date/Time */}
                                <div className="text-sm text-gray-500 mb-4">
                                    {activity.dateTime}
                                </div>

                                {/* Description */}
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    {activity.description}
                                </p>

                                {/* Location */}
                                <div className="flex items-start gap-2 text-gray-600 mb-6">
                                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{activity.location}</span>
                                </div>
                            </div>

                            {/* Map Section */}
                            <div className="mt-auto">
                                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                    {activity.mapUrl ? (
                                        <iframe
                                            src={activity.mapUrl}
                                            title={`Map for ${activity.title}`}
                                            className="w-full h-full rounded-lg"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="text-gray-400">
                                            <MapPin className="w-16 h-16" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Join Button */}
                            <div className="mt-6 flex justify-end">
                                <button className="px-8 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ActivityDetailPage;
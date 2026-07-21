import React from 'react';
import { Play, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import image1 from '../assets/encamadora_integral.jpg';
import image2 from '../assets/Desbrozadoradehojapapayocamote.jpg';
import image3 from '../assets/Cosechadora-de-papasycamote-nueva-presentacion.jpg';
import image4 from '../assets/picadoraestacionaria_chala4tn.jpg';
import image5 from '../assets/abonadora_hidraulica.jpg';

const videoMeta = [
  { id: 1, thumbnail: image1, videoUrl: 'https://www.youtube.com/embed/Df9nYUyeqKQ', titleKey: 'videoGallery.video1', descKey: 'videoGallery.video1' },
  { id: 2, thumbnail: image2, videoUrl: 'https://www.youtube.com/embed/bEw1sz8uqBA', titleKey: 'videoGallery.video2', descKey: 'videoGallery.video2' },
  { id: 3, thumbnail: image3, videoUrl: 'https://www.youtube.com/embed/TQa2QJd5V6Q', titleKey: 'videoGallery.video3', descKey: 'videoGallery.video3' },
  { id: 4, thumbnail: image4, videoUrl: 'https://www.youtube.com/embed/16TeUur6h4I?si=_TASIpou40ueYkJX', titleKey: 'videoGallery.video4', descKey: 'videoGallery.video4' },
  { id: 5, thumbnail: image5, videoUrl: 'https://www.youtube.com/embed/wxxXzlx5HpM?si=FYv2xYeAT59y6_hm', titleKey: 'videoGallery.video5', descKey: 'videoGallery.video5' },
];

const VideoGallery: React.FC = () => {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = React.useState<number | null>(null);
  const videos = videoMeta.map(v => ({
    ...v,
    title: t(`${v.titleKey}.title`),
    description: t(`${v.descKey}.description`),
  }));

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-8">
        {videos.map(video => (
          <div 
            key={video.id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => setSelectedVideo(video.id)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity hover:bg-opacity-40"
              >
                <Play className="h-12 w-12 text-white" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {video.title}
              </h3>
              <p className="text-gray-600">
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {videos.find(v => v.id === selectedVideo)?.title}
                </h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={videos.find(v => v.id === selectedVideo)?.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
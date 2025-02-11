"use client";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

const divisionPosts = [
  {
    category: "Dhaka Division",
    title: "Stunning Sunset at Hatirjheel",
    src: "https://placehold.co/1000x1000/jpeg?text=Dhaka+Division",
    content: (
      <div className="prose dark:prose-invert">
        <p>Experience the breathtaking sunset views at Hatirjheel, where urban development meets natural beauty.</p>
      </div>
    ),
  },
  {
    category: "Chittagong Division",
    title: "Misty Morning in Bandarban Hills",
    src: "https://placehold.co/1000x1000/jpeg?text=Chittagong+Division",
    content: (
      <div className="prose dark:prose-invert">
        <p>A serene morning in the Bandarban Hills, where clouds meet the mountains.</p>
      </div>
    ),
  },
  {
    category: "Sylhet Division",
    title: "Tea Gardens of Srimangal",
    src: "https://placehold.co/1000x1000/jpeg?text=Sylhet+Division",
    content: (
      <div className="prose dark:prose-invert">
        <p>Endless rows of tea plantations stretching across the hills of Srimangal.</p>
      </div>
    ),
  },
  {
    category: "Rajshahi Division",
    title: "Ancient Ruins of Paharpur",
    src: "https://placehold.co/1000x1000/jpeg?text=Rajshahi+Division",
    content: (
      <div className="prose dark:prose-invert">
        <p>The historical Buddhist Vihara at Paharpur, a UNESCO World Heritage site.</p>
      </div>
    ),
  },
  {
    category: "Khulna Division",
    title: "Sundarbans Mangrove Forest",
    src: "https://placehold.co/1000x1000/jpeg?text=Khulna+Division",
    content: (
      <div className="prose dark:prose-invert">
        <p>The world's largest mangrove forest, home to the Royal Bengal Tiger.</p>
      </div>
    ),
  },
  {
    category: "Barisal Division",
    title: "Floating Markets of Barisal",
    src: "https://placehold.co/1000x1000/jpeg?text=Barisal+Division",
    content: (
      <div className="prose dark:prose-invert">
        <p>Traditional floating markets where traders sell fresh produce from boats.</p>
      </div>
    ),
  },
  {
    category: "Rangpur Division",
    title: "Tajhat Palace Heritage",
    src: "https://placehold.co/1000x1000/jpeg?text=Rangpur+Division",
    content: (
      <div className="prose dark:prose-invert">
        <p>The magnificent Tajhat Palace, a testament to Bengal's architectural heritage.</p>
      </div>
    ),
  },
  {
    category: "Mymensingh Division",
    title: "China Clay Hills of Mymensingh",
    src: "https://placehold.co/1000x1000/jpeg?text=Mymensingh+Division",
    content: (
      <div className="prose dark:prose-invert">
        <p>The unique white clay hills forming a distinctive landscape.</p>
      </div>
    ),
  },
];

function HotPosts() {
  return (
    <div className="top-14 left-0 right-0 bg-background z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">Trending Across Bangladesh</h2>
        <Carousel
          items={divisionPosts.map((post, index) => (
            <Card
              key={index}
              card={post}
              index={index}
              layout={true}
            />
          ))}
        />
      </div>
    </div>
  );
}

export default HotPosts;
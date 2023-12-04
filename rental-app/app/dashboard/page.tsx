import Image from 'next/image';

export default function Page() {
  return (
    <main>
      <div className="flex-grow bg-gray-200">
        {/* Your image component or content goes here */}
        <div style={{ width: `100%`, height: `90vh` }}>
          <Image
            src="/music_shop1.png"
            alt="Image Content"
            width={6720}
            height={4480}
            className="h-full w-full rounded-md object-cover"
          />
        </div>
      </div>
    </main>
  );
}

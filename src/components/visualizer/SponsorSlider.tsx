import { InfiniteSlider } from "@/components/ui/infinite-slider";

const sponsors = [
  {
    name: "Open Source UC",
    logo: "/logos/OSUC.svg",
    width: "w-[180px]",
  },
  {
    name: "Pontificia Universidad Católica de Chile",
    logo: "/logos/UC.svg",
    width: "w-[400px]",
  },
  {
    name: "FEUC",
    logo: "/logos/feuc.svg",
    width: "w-[120px]",
  },
  {
    name: "GitHub",
    logo: "/logos/GitHub.svg",
    width: "w-[180px]",
  },
  {
    name: "ZeroFox",
    logo: "/logos/zerofox.svg",
    width: "w-[220px]",
  },
  {
    name: "Major League Hacking & Google",
    logo: "/logos/MLH Google.svg",
    width: "w-[250px]",
  },
];

interface Props {
  [key: string]: any;
}

export default function SponsorSlider(_props: Props) {
  return (
    <div className="w-full">
      <InfiniteSlider gap={64} speed={40} speedOnHover={20}>
        {sponsors.map((sponsor, index) => (
          <div
            key={index}
            className="flex items-center justify-center h-[80px]"
          >
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className={`${sponsor.width} h-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300`}
            />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}

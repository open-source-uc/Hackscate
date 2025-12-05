import { TextLoop } from "@/components/ui/text-loop";
import { Shield, GraduationCap, GithubIcon, Trophy, Newspaper } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SponsorOffer {
  text: string;
  url: string;
  sponsor: string;
  icon: LucideIcon;
}

const sponsorOffers: SponsorOffer[] = [
  {
    sponsor: "ZeroFox",
    text: "Postula a prácticas en ZeroFox a través de ",
    url: "zerofox.osuc.dev",
    icon: Shield,
  },
  {
    sponsor: "OSUC",
    text: "Únete a la comunidad de innovación tecnológica UC en ",
    url: "osuc.dev",
    icon: GraduationCap,
  },
  {
    sponsor: "GitHub",
    text: "Prueba GitHub Copilot gratis para estudiantes en ",
    url: "gh.io/hackscate25",
    icon: GithubIcon,
  },
  {
    sponsor: "MLH",
    text: "Únete a la mayor comunidad de hackers estudiantes en ",
    url: "mlh.io",
    icon: Trophy,
  },
  {
    sponsor: "OSUC",
    text: "Conoce las bases de la hackathon en ",
    url: "bases.osuc.dev",
    icon: Newspaper,
  },
];

interface Props {
  [key: string]: any;
}

export default function SponsorLoop(_props: Props) {
  return (
    <div className="text-center">
      <TextLoop
        className="text-2xl tablet:text-3xl desktop:text-2xl m-8 font-semibold"
        interval={15}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {sponsorOffers.map((offer, index) => {
          const Icon = offer.icon;
          return (
            <a
              key={index}
              href={offer.url}  
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-muted-foreground/80 w-full transition-colors duration-300 flex items-center justify-center gap-3"
            >
              <Icon className="w-6 h-6 tablet:w-7 tablet:h-7" />
              <div>
                <span>{offer.text}</span>
                <span className="italic decoration-2 underline-offset-8">{offer.url}</span>
              </div>
              <Icon className="w-6 h-6 tablet:w-7 tablet:h-7" />
            </a>
          );
        })}
      </TextLoop>
    </div>
  );
}

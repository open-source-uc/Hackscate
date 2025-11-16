import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
    question: string;
    answer: string;
}

interface Props {
    questions: FAQItem[];
}

export default function FAQAccordion({ questions }: Props) {
    return (
        <Accordion type="single" collapsible className="w-full">
            {questions.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-foreground text-lg font-medium">
                        {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base">
                        {item.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

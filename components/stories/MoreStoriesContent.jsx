"use client";

import SectionSubtitle from "@/components/ui/SectionSubtitle";
import SectionTitle from "@/components/ui/SectionTitle";
import { motion } from "motion/react";
import Image from "next/image";

export default function MoreStoriesContent() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-neutral-200/60" />
      <div className="container py-16 md:py-24">
        <div className="space-y-4 text-center mb-20">
          <SectionSubtitle align="center">More Stories</SectionSubtitle>
          <SectionTitle
            as="h1"
            size="hero"
            align="center"
            fullWidth
            underlineWidth="w-20 md:w-28"
            accentClassName="bg-gradient-to-r from-primary-500 to-primary-300"
          >
            More Stories
          </SectionTitle>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mt-10 max-w-3xl mx-auto"
        >
          <figure className="relative w-full md:float-right md:w-[26rem] md:ml-6 md:mb-2">
            <Image
              src="/imgs/more-stories.avif"
              alt="A Fairy-Tale Ending"
              width={1600}
              height={900}
              sizes="(min-width: 1024px) 26rem, 100vw"
              style={{ width: "100%", height: "auto" }}
              className="rounded-xl shadow-xl ring-1 ring-black/5 object-cover"
              priority={false}
            />
            <figcaption className="mt-2 text-sm text-neutral-600">
              Roadside verge on a quiet onion field route.
            </figcaption>
          </figure>

          <div className="mt-6 space-y-2">
            <SectionSubtitle align="left">Short Story</SectionSubtitle>
            <SectionTitle
              as="h2"
              size="section"
              align="left"
              underlineWidth="w-16"
              accentClassName="bg-primary-400"
            >
              A Fairy-Tale Ending
            </SectionTitle>
          </div>

          <div className="mt-6 space-y-6 text-neutral-800 text-[17px] md:text-lg leading-relaxed">
            <p>
              A loud pop stopped any more thoughts of magic as the car became
              hard to control. Not impossible, but the steering wheel started
              shaking and bucking, so Elizabeth knew she had a flat tire.
              Gritting her teeth, she pulled off the road onto the verge and
              looked around. A few feet away, on the other side of a barbed wire
              fence, lay a field of onions. No one was working there today.
              Across the road lay another field, also onions, also empty. No
              houses sat near the road along the this section—just fields,
              which, of course, was why the traffic was so light and why she’d
              taken this road in the first place.
            </p>
            <blockquote className="my-4 border-l-4 border-primary-300/70 pl-4 italic text-neutral-800/90">
              “Damn,” she said. She just wasn’t dressed for tire changing. But
              she hadn’t known when she picked out the blue sundress that she
              was going to have to change a tire, had she? “Damn,” she said once
              more. Not even the chicory and Queen Anne’s lace growing up and
              down the verge could cheer her up. Neither could the mockingbird
              singing brilliantly in a nearby bush. “Oh, shut up,” she muttered
              and waved an arm to chase away the flies that apparently liked her
              citrusy perfume as much as she did.
            </blockquote>
          </div>
        </motion.article>
      </div>
    </motion.section>
  );
}

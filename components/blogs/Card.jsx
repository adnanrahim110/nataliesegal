"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BsShareFill } from "react-icons/bs";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import {
  FiEye,
  FiHeart,
  FiLink,
  FiMessageSquare,
  FiShare2,
} from "react-icons/fi";

const Card = ({
  slug,
  imageUrl,
  category,
  date,
  title,
  authorName,
  authorImageUrl,
  views,
  comments,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const shareMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target)
      ) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/blogs/${slug}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
      setShowShareMenu(false);
    }, 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          url: `${window.location.origin}/blogs/${slug}`,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      setShowShareMenu(true);
    }
  };

  const postUrl = `${window.location.origin}/blogs/${slug}`;

  return (
    <div className="group relative rounded-3xl bg-white p-2 shadow-xl transition-all duration-500 ease-in-out hover:shadow-2xl hover:-translate-y-2 transform will-change-transform overflow-hidden">
      <div className="relative z-10 flex flex-col h-full">
        <Link
          href={`/blogs/${slug}`}
          className="block relative overflow-hidden rounded-2xl aspect-video mb-4"
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
            <span className="relative z-10 inline-block rounded-full bg-white/30 backdrop-blur-md px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white border border-white/40 shadow-md">
              {category}
            </span>
          </div>
        </Link>

        <div className="p-4 flex-grow flex flex-col">
          <div className="mb-2 text-sm text-neutral-500 font-medium">
            {date}
          </div>

          <h3 className="mb-4 text-2xl font-extrabold leading-tight tracking-wide text-gray-900">
            <Link
              href={`/blogs/${slug}`}
              className="hover:text-primary-700 transition-all duration-300 line-clamp-2 underline underline-offset-4 decoration-transparent hover:decoration-primary-600"
            >
              {title}
            </Link>
          </h3>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <Image
                src={authorImageUrl}
                alt={authorName}
                width={48}
                height={48}
                className="rounded-full object-cover size-10 border-2 border-primary-200 shadow-md"
              />
              <div>
                <p className="text-md font-semibold text-neutral-800">
                  {authorName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-neutral-600">
              <div className="flex items-center space-x-1">
                <FiEye className="h-4 w-4 text-primary-500" />
                <span>{views} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiMessageSquare className="h-4 w-4 text-primary-400" />
                <span>{comments} comments</span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
            <Link
              href={`/blogs/${slug}`}
              className="inline-flex items-center text-md font-bold text-primary-600 transition-all duration-300 hover:text-primary-700 group/readmore"
            >
              Read More
              <svg
                className="ml-1 h-5 w-5 group-hover/readmore:translate-x-1 transition-all duration-300 ease-in-out"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </Link>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isLiked
                    ? "text-primary-600 bg-primary-100 shadow-sm"
                    : "text-neutral-400 hover:text-primary-600 hover:bg-primary-100 hover:shadow-sm"
                } active:scale-95`}
                aria-label="Like post"
              >
                <FiHeart
                  size={20}
                  fill={isLiked ? "currentColor" : "none"}
                  className="heart-animation"
                />
              </button>

              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 rounded-full text-neutral-400 transition-all duration-300 hover:text-primary-600 hover:bg-primary-100 hover:shadow-sm active:scale-95"
                  aria-label="Share post"
                >
                  <FiShare2 size={20} />
                </button>

                {showShareMenu && (
                  <div className="absolute bottom-full right-0 z-20 mb-3 w-52 origin-bottom-right scale-95 opacity-0 animate-fadeInUp transform-gpu rounded-xl border border-gray-100 bg-white p-2 shadow-2xl transition-all duration-300 ease-out">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    >
                      <FaFacebook className="mr-3 h-5 w-5 text-[#1877F2]" />
                      Facebook
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    >
                      <FaLinkedin className="mr-3 h-5 w-5 text-[#0077B5]" />
                      LinkedIn
                    </a>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center w-full px-4 py-3 text-sm text-left text-neutral-700 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    >
                      <FiLink className="mr-3 h-5 w-5" />
                      {isCopied ? "Copied!" : "Copy Link"}
                    </button>
                    <button
                      onClick={handleNativeShare}
                      className="flex items-center w-full px-4 py-3 text-sm text-left text-neutral-700 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    >
                      <BsShareFill className="mr-3 h-5 w-5" />
                      Share...
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconMail,
} from "@tabler/icons-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function SideBar() {
  return (
    <ul
      className="fixed right-0 top-1/2 -translate-y-1/2 
    flex flex-col items-center justify-center space-y-2
    transition-transform duration-300 ease-in-out transform-gpu
    z-51"
      role="list"
    >
      <li className="bg-transparent hover:bg-white/10 rounded-full p-2 transition-transform duration-300 ease-in-out hover:-translate-x-4">
        <a
          href="https://www.joechow.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center"
        >
          <img
            src={`${BASE_URL}avatar.png`}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </a>
      </li>
      <li className="bg-transparent hover:bg-white/10 backdrop-blur-sm rounded-full p-2 transition-transform duration-300 ease-in-out hover:-translate-x-4">
        <a
          target="_blank"
          href="https://github.com/joyjoy998"
          rel="noopener noreferrer"
          className="flex justify-center items-center"
        >
          <IconBrandGithub className="w-6 h-6" />
        </a>
      </li>
      <li className="bg-transparent hover:bg-white/10 backdrop-blur-sm rounded-full p-2 transition-transform duration-300 ease-in-out hover:-translate-x-4">
        <a
          target="_blank"
          href="https://www.linkedin.com/in/haochuan-zhou/"
          rel="noopener noreferrer"
          className="flex justify-center items-center"
        >
          <IconBrandLinkedin className="w-6 h-6" />
        </a>
      </li>
      <li className="bg-transparent hover:bg-white/10 backdrop-blur-sm rounded-full p-2 transition-transform duration-300 ease-in-out hover:-translate-x-4">
        <a
          target="_blank"
          href="mailto:mrzhouhc@gmail.com"
          rel="noopener noreferrer"
          className="flex justify-center items-center"
        >
          <IconMail className="w-6 h-6" />
        </a>
      </li>
    </ul>
  );
}

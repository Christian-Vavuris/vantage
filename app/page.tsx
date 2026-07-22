"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const PLACEHOLDER_DEFAULT = "Ask a question about Christian…";

const PLACEHOLDER_EXAMPLES = [
  "What are Christian's top three qualifications?",
  "How does Christian earn credibility with engineering and finance?",
  "Why does Vantage's mission resonate with Christian?",
];

const SUGGESTED_QUESTIONS = [
  "What are Christian's top three qualifications as an Enterprise Account Executive candidate at Vantage?",
  "Vantage is hiring for a recently formed sales team with large, undefined territories. How does Christian's experience at BRM map to that?",
  "Walk me through the Gemini expansion at Taxbit — how does that map to the account-growth motion Vantage needs?",
  "Vantage's buyers span engineering and the C-suite. How does Christian earn credibility across both in the same deal?",
  "How does Christian use cross-platform intelligence to win new logos and expand existing relationships — and what's an example of him doing that in the past?",
];

type DisplayMessage = { role: "user" | "assistant"; content: string };

function VantageLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 91 24"
      aria-label="Vantage logo"
      className="h-6 w-auto"
      fill="none"
    >
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#6742D6"
          d="M5.28508 2.02236C7.24068 0.703789 9.53982 0 11.8918 0C13.4536 -0.000433521 15.0002 0.309661 16.4431 0.91256C17.8861 1.51547 19.1972 2.39936 20.3016 3.51375C21.406 4.62813 22.2819 5.95118 22.8793 7.40729C23.4768 8.86339 23.7841 10.424 23.7836 12C23.7836 14.3733 23.0862 16.6934 21.7795 18.6668C20.4728 20.6403 18.6156 22.1783 16.4426 23.0866C14.2697 23.9948 11.8786 24.2324 9.57182 23.7694C7.26505 23.3064 5.14614 22.1635 3.48304 20.4852C1.81994 18.807 0.687352 16.6689 0.228504 14.3411C-0.230345 12.0133 0.00515151 9.60053 0.905218 7.40781C1.80528 5.21509 3.32948 3.34094 5.28508 2.02236ZM3.34202 10.3716L6.90989 13.9752C6.94532 14.0123 6.98776 14.0418 7.03472 14.0619C7.08168 14.082 7.13218 14.0924 7.1832 14.0924C7.23422 14.0924 7.28474 14.082 7.3317 14.0619C7.37867 14.0418 7.42111 14.0123 7.45652 13.9752L11.0179 10.3716C11.089 10.2997 11.129 10.2023 11.129 10.1007C11.129 9.9992 11.089 9.90178 11.0179 9.82987L7.4467 6.22956C7.37549 6.15776 7.27897 6.11742 7.17831 6.11742C7.07764 6.11742 6.98109 6.15776 6.90989 6.22956L3.34202 9.82987C3.27085 9.90178 3.2309 9.9992 3.2309 10.1007C3.2309 10.2023 3.27085 10.2997 3.34202 10.3716ZM12.1603 18.7283L15.7281 15.128C15.7993 15.0562 15.8392 14.9588 15.8392 14.8572C15.8392 14.7556 15.7993 14.6581 15.7281 14.5863L12.1603 10.9827C12.0891 10.9108 11.9924 10.8705 11.8918 10.8705C11.7911 10.8705 11.6946 10.9108 11.6234 10.9827L8.05227 14.5863C7.98111 14.6581 7.94113 14.7556 7.94113 14.8572C7.94113 14.9588 7.98111 15.0562 8.05227 15.128L11.6234 18.7283C11.6946 18.8001 11.7911 18.8404 11.8918 18.8404C11.9924 18.8404 12.0891 18.8001 12.1603 18.7283ZM16.8705 13.9752L20.4383 10.3716C20.474 10.3363 20.5023 10.294 20.5216 10.2476C20.5409 10.2011 20.5508 10.1512 20.5508 10.1007C20.5508 10.0503 20.5409 10.0004 20.5216 9.95387C20.5023 9.90738 20.474 9.86525 20.4383 9.82987L16.8705 6.22956C16.7993 6.15776 16.7028 6.11742 16.602 6.11742C16.5014 6.11742 16.4049 6.15776 16.3337 6.22956L12.7625 9.82987C12.6914 9.90178 12.6514 9.9992 12.6514 10.1007C12.6514 10.2023 12.6914 10.2997 12.7625 10.3716L16.3337 13.9752C16.4049 14.047 16.5014 14.0874 16.602 14.0874C16.7028 14.0874 16.7993 14.047 16.8705 13.9752Z"
        />
        <path
          fill="#6742D6"
          d="M27.844 5.23879L31.582 17.6748C31.6013 17.7516 31.6473 17.8189 31.7115 17.8644C31.7758 17.9098 31.8542 17.9305 31.9322 17.9225H34.1679C34.2435 17.9312 34.3195 17.9104 34.3804 17.8644C34.4413 17.8182 34.4824 17.7504 34.4953 17.6748L38.1908 5.23879C38.2432 5.08024 38.1745 4.95472 38.014 4.95472H36.3283C36.2561 4.95139 36.1849 4.97226 36.1256 5.01409C36.0664 5.05592 36.0225 5.11634 36.0009 5.18594L34.109 11.759C33.7457 12.9976 33.3365 14.4873 33.091 15.6005H33.0386C32.8095 14.5038 32.4069 13.0142 32.0567 11.792L30.1254 5.18594C30.1149 5.11609 30.078 5.05306 30.0225 5.00999C29.967 4.9669 29.8971 4.94711 29.8275 4.95472H28.001C27.9676 4.95312 27.9344 4.96097 27.9051 4.97738C27.8758 4.9938 27.8516 5.01814 27.8354 5.04765C27.819 5.07717 27.8112 5.1107 27.8127 5.14446C27.8142 5.17823 27.825 5.21089 27.844 5.23879Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#6742D6"
          d="M45.9343 11.1802V17.6806C45.9379 17.7141 45.934 17.7478 45.923 17.7796C45.9119 17.8113 45.894 17.8401 45.8704 17.8639C45.8468 17.8877 45.8183 17.9058 45.7868 17.917C45.7554 17.9281 45.7219 17.932 45.6888 17.9284H44.1438C44.1107 17.932 44.0772 17.9281 44.0457 17.917C44.0143 17.9058 43.9857 17.8877 43.9621 17.8639C43.9386 17.8401 43.9206 17.8113 43.9096 17.7796C43.8985 17.7478 43.8947 17.7141 43.8983 17.6806V16.5213C43.6143 17.0082 43.2091 17.4117 42.7227 17.6916C42.2363 17.9715 41.6858 18.118 41.1259 18.1166C39.2994 18.1166 38.1406 16.911 38.1406 15.1438C38.1406 13.3767 39.2994 12.3461 41.8263 12.1711C42.4864 12.1212 43.1491 12.1157 43.81 12.1546V11.2661C43.81 10.1694 43.2142 9.72686 42.2125 9.72686C41.2109 9.72686 40.8444 10.0968 40.5923 10.7904C40.5203 10.9853 40.4516 11.0183 40.265 10.9655L38.7364 10.5757C38.5792 10.5229 38.5268 10.4337 38.5792 10.2917C38.8607 8.91105 40.1078 7.95312 42.301 7.95312C44.566 7.95312 45.9343 9.03655 45.9343 11.1802ZM43.81 14.774V13.5717C43.2076 13.5461 42.6042 13.5572 42.0031 13.6046C40.8607 13.7301 40.2126 14.1199 40.2126 15.0414C40.2126 15.8375 40.7559 16.3627 41.6856 16.3627C42.6708 16.3528 43.4236 15.7682 43.81 14.774Z"
        />
        <path
          fill="#6742D6"
          d="M50.1803 17.6797V11.6549C50.5306 10.6475 51.3031 9.95385 52.2392 9.95385C53.2212 9.95385 53.7155 10.5947 53.7155 11.6549V17.6797C53.7155 17.8383 53.8006 17.9275 53.9774 17.9275H55.6467C55.6802 17.9332 55.7146 17.9308 55.7471 17.9204C55.7794 17.9099 55.8089 17.8919 55.8329 17.8676C55.8569 17.8434 55.8749 17.8137 55.8852 17.781C55.8955 17.7483 55.8979 17.7136 55.8922 17.6797V11.3015C55.8922 9.31643 54.8906 7.96875 53.0478 7.96875C52.4674 7.97493 51.8975 8.12558 51.3888 8.40735C50.88 8.68911 50.448 9.09323 50.1312 9.58399V8.37833C50.1329 8.34608 50.1276 8.31386 50.1156 8.28391C50.1036 8.25398 50.0853 8.22704 50.0619 8.20502C50.0384 8.18298 50.0106 8.16639 49.9801 8.15638C49.9497 8.14638 49.9175 8.14321 49.8857 8.14711H48.2491C48.2171 8.14269 48.1845 8.14545 48.1536 8.15522C48.1229 8.16498 48.0945 8.1815 48.0708 8.20359C48.047 8.22568 48.0283 8.2528 48.0162 8.28301C48.004 8.31322 47.9986 8.34576 48.0003 8.37833V17.6797C48.0003 17.8383 48.0887 17.9275 48.2655 17.9275H49.9349C49.9679 17.9311 50.0015 17.9272 50.0329 17.9161C50.0644 17.9049 50.0929 17.8867 50.1165 17.863C50.14 17.8392 50.158 17.8104 50.1691 17.7787C50.1801 17.747 50.1839 17.7131 50.1803 17.6797Z"
        />
        <path
          fill="#6742D6"
          d="M60.6582 5.9831V8.21596H62.5894C62.7302 8.21596 62.8185 8.30515 62.8185 8.48021V9.75853C62.8185 9.93355 62.7302 10.0062 62.5894 10.0062H60.6582V14.9311C60.6582 15.6379 61.0444 15.9913 61.8333 15.9913H62.573C62.6067 15.9862 62.6411 15.9892 62.6735 16C62.7058 16.0109 62.7351 16.0293 62.7591 16.0537C62.7831 16.0783 62.8009 16.1081 62.8112 16.1408C62.8215 16.1736 62.824 16.2085 62.8185 16.2424V17.676C62.8242 17.7097 62.8218 17.7445 62.8115 17.7771C62.8012 17.8098 62.7832 17.8395 62.7592 17.8638C62.7351 17.888 62.7057 17.9062 62.6733 17.9166C62.6409 17.927 62.6065 17.9294 62.573 17.9236H61.483C59.5191 17.9236 58.537 16.86 58.537 15.2317V10.0062H57.326C57.2926 10.0112 57.2584 10.0083 57.2264 9.99764C57.1943 9.98698 57.1653 9.96884 57.1414 9.94475C57.1175 9.92067 57.0996 9.89124 57.089 9.85889C57.0784 9.82662 57.0755 9.79222 57.0805 9.75853V8.48021C57.0805 8.30515 57.1688 8.21596 57.326 8.21596H58.5535V5.9831C58.551 5.94994 58.5557 5.91663 58.5672 5.88546C58.5786 5.85428 58.5966 5.82597 58.6199 5.80245C58.6432 5.77894 58.6712 5.76077 58.7022 5.7492C58.733 5.73762 58.7661 5.73291 58.7989 5.73537H60.4159C60.4487 5.73224 60.4819 5.73652 60.5129 5.74792C60.5439 5.75931 60.5721 5.77752 60.5953 5.80123C60.6184 5.82495 60.6361 5.85356 60.6471 5.88502C60.6579 5.91648 60.6617 5.94998 60.6582 5.9831Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#6742D6"
          d="M71.6218 17.6806V11.1802C71.6218 9.03655 70.2535 7.95312 67.9885 7.95312C65.7953 7.95312 64.5449 8.9242 64.2667 10.2917C64.2143 10.4337 64.2667 10.5229 64.4239 10.5757L65.9558 10.9655C66.1423 11.0183 66.2143 10.9853 66.2831 10.7904C66.5319 10.0968 66.8984 9.72686 67.9 9.72686C68.9016 9.72686 69.4975 10.1694 69.4975 11.2661V12.1546C68.8366 12.1157 68.1739 12.1212 67.5138 12.1711C64.9836 12.3461 63.8281 13.3767 63.8281 15.1438C63.8281 16.911 64.9836 18.1166 66.8101 18.1166C67.3704 18.1182 67.9215 17.9718 68.4085 17.6919C68.8954 17.4121 69.3013 17.0085 69.5858 16.5213V17.6806C69.5822 17.7141 69.586 17.7478 69.5971 17.7796C69.6081 17.8113 69.6261 17.8401 69.6496 17.8639C69.6732 17.8877 69.7018 17.9058 69.7332 17.917C69.7647 17.9281 69.7982 17.932 69.8313 17.9284H71.3763C71.4094 17.932 71.4429 17.9281 71.4743 17.917C71.5058 17.9058 71.5343 17.8877 71.5579 17.8639C71.5815 17.8401 71.5994 17.8113 71.6105 17.7796C71.6215 17.7478 71.6254 17.7141 71.6218 17.6806ZM69.4975 13.5717V14.774C69.1111 15.7682 68.3551 16.3528 67.3731 16.3627C66.4434 16.3627 65.8968 15.8375 65.8968 15.0414C65.8968 14.1199 66.5482 13.7301 67.6873 13.6046C68.2895 13.5572 68.8939 13.5461 69.4975 13.5717Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#6742D6"
          d="M81.7375 18.5948C81.7375 20.2463 80.5067 21.6402 77.1909 21.6402C74.186 21.6402 73.0469 20.5799 73.0469 19.0209C73.0469 18.1885 73.5379 17.409 74.5395 16.9829C74.3364 16.8326 74.1692 16.6383 74.0502 16.4142C73.9312 16.1902 73.8636 15.942 73.8521 15.6881C73.8536 15.3792 73.9485 15.078 74.1239 14.8249C74.2993 14.5717 74.547 14.3786 74.8342 14.2711C74.3571 13.9975 73.964 13.5966 73.6978 13.1124C73.4317 12.6282 73.3027 12.0794 73.3251 11.5263C73.3251 9.5775 74.5167 8.14062 77.0992 8.14062H81.4527C81.4807 8.14224 81.5081 8.1496 81.5332 8.16227C81.5582 8.17493 81.5805 8.19262 81.5986 8.21427C81.6166 8.23591 81.6302 8.26105 81.6383 8.28815C81.6464 8.31524 81.649 8.34371 81.6458 8.37183V9.61376C81.6477 9.64683 81.6427 9.67989 81.631 9.71082C81.6193 9.74175 81.6014 9.76984 81.5782 9.79322C81.555 9.8166 81.5271 9.83482 81.4965 9.84655C81.4658 9.85838 81.4331 9.86345 81.4003 9.8615H79.8717C80.1541 10.105 80.3782 10.4097 80.5272 10.7529C80.6763 11.0961 80.7465 11.4689 80.7326 11.8434C80.7326 13.5279 79.5574 14.8161 77.1319 14.8161H76.5166C75.9372 14.8161 75.6918 15.0671 75.6918 15.4008C75.6918 15.7344 75.9568 15.9523 76.5166 15.9523H78.5198C80.7882 15.9722 81.7375 17.0886 81.7375 18.5948ZM79.6655 18.7897C79.6655 18.2216 79.3382 17.6898 78.2088 17.6898H76.4348C75.3971 17.6898 75.0305 18.2414 75.0305 18.8062C75.0305 19.622 75.6852 20.1538 77.3218 20.1538C78.9584 20.1538 79.6655 19.5692 79.6655 18.7897ZM75.2891 11.5263C75.2891 12.5898 75.9045 13.2967 77.0992 13.2967C78.222 13.2967 78.8537 12.6592 78.8537 11.5427C78.8537 10.4792 78.2743 9.78887 77.0796 9.78887C75.8848 9.78887 75.2891 10.4264 75.2891 11.5263Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#6742D6"
          d="M84.7524 14.2785V13.7136H90.2255C90.5588 13.7136 90.6673 13.5717 90.6673 13.2876V11.7979C90.6673 9.60465 89.3348 7.95312 86.7394 7.95312C84.0356 7.95312 82.6641 9.62117 82.6641 11.8342V14.2421C82.6641 16.5113 84.088 18.1232 86.7721 18.1232C88.6149 18.1232 89.9668 17.3437 90.5464 16.0522C90.6539 15.8375 90.6344 15.6955 90.389 15.5733L89.2824 15.0052C89.0539 14.8995 88.9686 14.9357 88.8277 15.1637C88.4938 15.821 88.101 16.333 86.7917 16.333C85.4071 16.3165 84.7524 15.5369 84.7524 14.2785ZM84.7524 12.2603V11.745C84.7524 10.5427 85.3777 9.74339 86.687 9.74339C87.9962 9.74339 88.6509 10.5427 88.6509 11.745V12.2603H84.7524Z"
        />
      </g>
    </svg>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDER_DEFAULT);
  const latestQuestionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (messages.length > 0 || input) {
      setPlaceholder(PLACEHOLDER_DEFAULT);
      return;
    }

    let cancelled = false;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    async function animate() {
      while (!cancelled) {
        for (const question of PLACEHOLDER_EXAMPLES) {
          for (let i = 1; i <= question.length; i++) {
            if (cancelled) return;
            setPlaceholder(question.slice(0, i));
            await wait(28);
          }
          await wait(1100);
          for (let i = question.length; i >= 0; i--) {
            if (cancelled) return;
            setPlaceholder(question.slice(0, i));
            await wait(16);
          }
          await wait(250);
        }
        for (let i = 0; i < 3 && !cancelled; i++) {
          setPlaceholder("...");
          await wait(500);
          if (cancelled) return;
          setPlaceholder("");
          await wait(500);
        }
      }
    }

    animate();

    return () => {
      cancelled = true;
    };
  }, [messages.length, input]);

  useEffect(() => {
    if (messages[messages.length - 1]?.role === "user") {
      latestQuestionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInput("");

    const nextMessages: DisplayMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "" },
      ]);
    } catch {
      setError("Something went wrong reaching the AI Cover Letter. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:py-20">
      <VantageLogo />

      <h1 className="mb-8 mt-5 text-3xl font-bold text-[#0a0a0a] sm:text-4xl">
        Christian Vavuris, Enterprise Account Executive Candidate at Vantage
      </h1>

      <div className="text-[17px] leading-[1.75] text-gray-700">
        <p className="mb-[18px]">
          I&apos;m{" "}
          <a
            href="https://www.linkedin.com/in/cvavuris/?skipRedirect=true"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6742D6] underline underline-offset-2 hover:text-[#5636b0]"
          >
            Christian Vavuris
          </a>
          , an account executive with 10+ years selling technical
          infrastructure products to engineering and finance leaders.
        </p>
        <p className="mb-[18px]">
          This AI Cover Letter is built to help Vantage&apos;s team quickly
          understand my qualifications as a candidate for the{" "}
          <a
            href="https://jobs.ashbyhq.com/vantage/073eb88a-bc36-4ffe-bd4f-465bd53a1410"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6742D6] underline underline-offset-2 hover:text-[#5636b0]"
          >
            Enterprise Account Executive
          </a>{" "}
          role. Use the text box below to ask any questions you&apos;d like
          about my background and qualifications.
        </p>
        <p>
          Here is a copy of my{" "}
          <a
            href="https://drive.google.com/file/d/15KOYS1W8pQ7i_ET4DvBvUUBihsVg5hBG/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6742D6] underline underline-offset-2 hover:text-[#5636b0]"
          >
            resume
          </a>
          , and at the bottom of the page are some example questions you can
          use to get started.
        </p>
      </div>

      <div className="mt-8 rounded-md border border-gray-200 bg-white shadow-sm">
        {(messages.length > 0 || loading) && (
          <div className="max-h-[420px] overflow-y-auto p-5 sm:p-6">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <p
                  key={i}
                  ref={i === messages.length - 1 ? latestQuestionRef : undefined}
                  className={`scroll-mt-4 text-[16px] font-bold text-[#0a0a0a] ${
                    i === 0 ? "" : "mt-6 border-t border-gray-200 pt-6"
                  }`}
                >
                  {m.content}
                </p>
              ) : (
                <div
                  key={i}
                  className="mt-3 space-y-3 text-[16px] leading-[1.75] text-gray-700 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_strong]:font-bold [&_strong]:text-[#0a0a0a] [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5"
                >
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              )
            )}
            {loading && (
              <p className="mt-3 text-[16px] text-gray-400">Thinking…</p>
            )}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className={`flex items-center gap-3 p-4 ${
            messages.length > 0 || loading ? "border-t border-gray-200" : ""
          }`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="flex-1 bg-transparent text-[16px] text-[#0a0a0a] placeholder:text-gray-400 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="text-[15px] font-bold text-[#6742D6] hover:text-[#5636b0] disabled:text-gray-300"
          >
            Send
          </button>
        </form>
      </div>

      <p className="mt-2.5 text-[12px] text-gray-500">
        AI Cover Letter answering on Christian&apos;s behalf, based on
        information he&apos;s provided.
      </p>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <div className="mt-12 flex flex-col">
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <button
            key={q}
            type="button"
            onClick={() => sendMessage(q)}
            disabled={loading}
            className={`group flex items-start gap-2 border-t border-gray-200 px-2 py-2.5 text-left text-[15px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#6742D6] disabled:opacity-50 ${
              i === SUGGESTED_QUESTIONS.length - 1 ? "border-b" : ""
            }`}
          >
            <span
              aria-hidden
              className="mt-0.5 shrink-0 text-gray-400 transition-colors group-hover:text-[#6742D6]"
            >
              →
            </span>
            <span>{q}</span>
          </button>
        ))}
      </div>

      <div className="mt-12 border-t border-gray-200 pt-6 text-[15px] text-gray-600">
        <p>
          <a
            href="mailto:cvavuris@gmail.com"
            className="text-[#6742D6] underline underline-offset-2 hover:text-[#5636b0]"
          >
            cvavuris@gmail.com
          </a>
        </p>
        <p className="mt-1">
          <a
            href="tel:+14152464384"
            className="text-[#6742D6] underline underline-offset-2 hover:text-[#5636b0]"
          >
            1-415-246-4384
          </a>
        </p>
        <p className="mt-1">
          <a
            href="https://www.linkedin.com/in/cvavuris/?skipRedirect=true"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6742D6] underline underline-offset-2 hover:text-[#5636b0]"
          >
            linkedin.com/in/cvavuris
          </a>
        </p>
      </div>
    </main>
  );
}

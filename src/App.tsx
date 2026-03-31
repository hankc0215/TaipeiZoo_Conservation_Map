import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Globe, Landmark, Search, ShieldCheck } from "lucide-react";

type ConservationType = "救傷" | "域外保育" | "教育推廣" | "國際合作" | "組織參與";
type AnimalGroup = "哺乳類" | "鳥類" | "爬蟲類" | "多類群";
type OrgTag = "WAZA" | "EAZA" | "SEAZA" | "AZA" | "JAZA" | "ZAA";

type NewsLink = {
  label: string;
  url: string;
  year?: string;
};

type VideoLink = {
  label: string;
  url: string;
  note?: string;
};

type SpeciesItem = {
  name: string;
  sci: string;
  status: string;
  statusClass: string;
  tags: string[];
  summary?: string;
  role?: string;
  relatedNewsLabels?: string[];
};

type OrganizationItem = {
  name: string;
  fullName: string;
  note: string;
  tone: string;
};

type PartnerItem = {
  name: string;
  role: string;
  note: string;
};

type ActionItem = {
  title: string;
  desc: string;
};

type RegionId =
  | "all"
  | "northamerica"
  | "taiwan"
  | "eastasia"
  | "southeast"
  | "africa"
  | "europe";

type RegionData = {
  id: RegionId;
  label: string;
  emoji: string;
  title: string;
  subtitle: string;
  desc: string;
  iconBg: string;
  iconText: string;
  icon: string;
  conservationTypes: ConservationType[];
  animalGroups: AnimalGroup[];
  orgTags: OrgTag[];
  newsLinks: NewsLink[];
  videoLinks?: VideoLink[];
  summaryLabel?: string;
  summaryColor?: string;
  summarySpecies?: string;
  stats?: Array<{ value: string; label: string }>;
  organizations?: OrganizationItem[];
  partners?: PartnerItem[];
  actions?: ActionItem[];
  species?: SpeciesItem[];
};

type MapDot = {
  id: string;
  region: Exclude<RegionId, "all">;
  x: number;
  y: number;
  label: string;
  color: string;
  size: number;
  tooltipTitle: string;
  tooltipSubtitle: string;
};

const regionOrder: RegionId[] = ["all", "northamerica", "taiwan", "eastasia", "southeast", "africa", "europe"];
const conservationTypeOptions: ConservationType[] = ["救傷", "域外保育", "教育推廣", "國際合作", "組織參與"];
const animalGroupOptions: AnimalGroup[] = ["哺乳類", "鳥類", "爬蟲類", "多類群"];
const orgTagOptions: OrgTag[] = ["WAZA", "EAZA", "SEAZA", "AZA", "JAZA", "ZAA"];

const regionsData: RegionData[] = [
  {
    id: "all",
    label: "全部",
    emoji: "🌏",
    title: "臺北市立動物園保育行動",
    subtitle: "點選地圖上的區域或標籤，探索各地的保育計畫",
    desc:
      "臺北市立動物園長期投入臺灣本土物種保育、野生動物救傷、域外保種、國際合作與環境教育，並透過研究、照養管理、跨機構夥伴關係與公眾溝通，持續擴大保育工作的影響力。這張地圖整理了動物園在不同區域的保育行動與合作脈絡，從臺灣本島、離島棲地到亞洲、歐洲與北美的國際網絡，帶你看見每一項保育工作如何與物種、棲地及社會連結。",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-800",
    icon: "🌿",
    conservationTypes: ["救傷", "域外保育", "教育推廣", "國際合作", "組織參與"],
    animalGroups: ["多類群"],
    orgTags: ["WAZA", "EAZA", "SEAZA", "AZA", "ZAA"],
    stats: [
      { value: "6 大面向", label: "保育主題" },
      { value: "10+ 計畫／合作", label: "可持續擴充" },
      { value: "5 個組織脈絡", label: "國際組織與認證" },
    ],
    organizations: [
      {
        name: "WAZA",
        fullName: "世界動物園暨水族館協會",
        note: "台北動物園長期參與國際網絡，並曾主辦 2004 年 WAZA 年會。",
        tone: "bg-emerald-50 text-emerald-800 border-emerald-200",
      },
      {
        name: "SEAZA",
        fullName: "東南亞動物園暨水族館協會",
        note: "參與創立脈絡深，持續投入區域年會、專業交流與東南亞保育合作。",
        tone: "bg-amber-50 text-amber-800 border-amber-200",
      },
      {
        name: "EAZA",
        fullName: "歐洲動物園暨水族館協會",
        note: "2018 年通過審查成為正式成員，支撐歐洲合作與穿山甲保育計畫。",
        tone: "bg-violet-50 text-violet-800 border-violet-200",
      },
      {
        name: "AZA",
        fullName: "北美動物園暨水族館協會",
        note: "2023 年啟動認證申請，2024 年完成實地審查與聽證程序。",
        tone: "bg-blue-50 text-blue-800 border-blue-200",
      },
      {
        name: "ZAA",
        fullName: "紐澳動物園暨水族館協會",
        note: "建園 110 週年官方新聞中列為與會的國際夥伴組織之一。",
        tone: "bg-sky-50 text-sky-800 border-sky-200",
      },
    ],
    videoLinks: [
      {
        label: "臺北動物園建園110週年園慶影片（完整版）",
        url: "https://www.youtube.com/watch?v=-Fng08GuO8A",
        note: "總覽台北動物園的保育工作與代表物種。",
      },
    ],
    newsLinks: [
      {
        label: "Reverse the Red 聯盟行動",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=4E62EDF385D3E8F2&sms=72544237BBE4C5F6",
        year: "2026",
      },
      {
        label: "瀕危動物故事館開幕",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=4110CD722E877729&sms=72544237BBE4C5F6",
        year: "2024",
      },
      {
        label: "2024 年大事紀",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=6994C1D3233D329A&s=516FCFCB6F236A12",
        year: "2024",
      },
    ],
  },
  {
    id: "northamerica",
    label: "北美 / AZA",
    emoji: "🇺🇸",
    title: "北美 AZA 認證與合作",
    subtitle: "AZA 申請進度、精進計畫與跨區域合作",
    desc:
      "臺北市立動物園自 2023 年 7 月起展開 AZA 認證申請準備，並於 2023 年 9 月提交書面申請；2024 年 1 月接受 AZA 專家來臺實地審查，後續也持續透過動物認養保育計畫推動「AZA 認證申請－大象管理團隊精進計畫」。除了認證準備，臺北市立動物園也和 AZA、EAZA 共同參與跨區域族群管理合作，例如侏儒河馬 Thabo 抵臺案。",
    iconBg: "bg-blue-100",
    iconText: "text-blue-800",
    icon: "🦬",
    summaryLabel: "AZA 認證",
    summaryColor: "bg-blue-100 text-blue-800",
    summarySpecies: "侏儒河馬",
    conservationTypes: ["國際合作", "組織參與", "域外保育"],
    animalGroups: ["哺乳類"],
    orgTags: ["AZA", "EAZA"],
    partners: [
      {
        name: "AZA",
        role: "認證與專業審查體系",
        note: "提供動物園治理、動物照養與營運標準的認證架構。",
      },
      {
        name: "EAZA",
        role: "跨區域族群管理合作",
        note: "與 AZA 共同支援侏儒河馬等物種的跨區域保種合作。",
      },
    ],
    actions: [
      {
        title: "推進 AZA 認證申請",
        desc: "從書面申請、實地審查到聽證程序，逐步與國際標準接軌。",
      },
      {
        title: "精進大象管理團隊",
        desc: "透過動物認養保育計畫強化專業能力與管理制度。",
      },
      {
        title: "串連跨區域族群合作",
        desc: "結合 AZA 與 EAZA 網絡，支撐侏儒河馬等物種的保種工作。",
      },
    ],
    videoLinks: [
      {
        label: "Thabo來了",
        url: "https://www.youtube.com/shorts/JHzF3ornz8c",
        note: "侏儒河馬 Thabo 抵臺的官方短片。",
      },
      {
        label: "侏儒河馬「Thabo」",
        url: "https://www.youtube.com/shorts/ky1gO2WXLpA",
        note: "Thabo 名字與保育期待的介紹。",
      },
      {
        label: "【稍微Zoo一下】侏儒河馬",
        url: "https://www.youtube.com/watch?v=9g5VpJ6Hmds",
        note: "以輕鬆近距離鏡頭介紹侏儒河馬。",
      },
    ],
    newsLinks: [
      {
        label: "AZA 認證申請與實地審查",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=F18B015186A5F770&s=F43396E575ECA133&sms=5B8197AA5783E7B9",
        year: "2024",
      },
      {
        label: "侏儒河馬 Thabo 可愛亮相",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=FC23F4EA610EC51F&sms=72544237BBE4C5F6",
        year: "2024",
      },
      {
        label: "侏儒河馬 Thabo 離世新聞",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=4899EBDFFCA1ABB8&sms=72544237BBE4C5F6",
        year: "2024",
      },
    ],
    species: [
      {
        name: "AZA 認證申請",
        sci: "Association of Zoos & Aquariums",
        status: "2023 啟動",
        statusClass: "bg-blue-100 text-blue-800",
        tags: ["2024 實地審查", "國際標準"],
        summary: "台北市立動物園正逐步推進 AZA 認證申請，將園務治理、動物照養、專業制度與國際標準接軌。",
        role: "作為申請方，動物園整合治理、照養、教育與動物福祉制度，持續朝認證標準精進。",
        relatedNewsLabels: ["AZA 認證申請與實地審查"],
      },
      {
        name: "大象管理團隊精進計畫",
        sci: "AZA accreditation improvement plan",
        status: "114／115 年延續",
        statusClass: "bg-sky-100 text-sky-800",
        tags: ["動物認養保育計畫", "專業精進"],
        summary: "以大象管理為核心持續精進專業能力與團隊制度，作為 AZA 認證準備的一部分。",
        role: "透過計畫資源投入團隊訓練、制度優化與照養管理提升。",
      },
      {
        name: "侏儒河馬跨區域合作",
        sci: "Pygmy Hippopotamus",
        status: "跨 AZA / EAZA",
        statusClass: "bg-indigo-100 text-indigo-800",
        tags: ["族群管理", "Thabo 抵臺"],
        summary: "侏儒河馬個體的跨區域調度呈現了北美與歐洲協會協作下的保種網絡。",
        role: "動物園作為接收與照養單位，參與跨區域族群管理與展示教育。",
        relatedNewsLabels: ["侏儒河馬 Thabo 可愛亮相", "侏儒河馬 Thabo 離世新聞"],
      },
    ],
  },
  {
    id: "taiwan",
    label: "台灣本土",
    emoji: "🇹🇼",
    title: "台灣本土保育",
    subtitle: "淺山保育、救傷收容、離島棲地關注",
    desc:
      "以臺灣本島與金門為核心，呈現石虎、穿山甲、歐亞水獺、雲豹與臺灣黑熊等焦點物種的救傷、棲地連結、域外保育與教育推廣工作。",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-800",
    icon: "🐾",
    summaryLabel: "本土保育",
    summaryColor: "bg-emerald-100 text-emerald-800",
    summarySpecies: "雲豹",
    conservationTypes: ["救傷", "教育推廣", "域外保育"],
    animalGroups: ["哺乳類"],
    orgTags: [],
    partners: [
      {
        name: "金門地方保育網絡",
        role: "離島棲地合作",
        note: "聚焦水獺棲地、社區教育與保育行動的在地連結。",
      },
      {
        name: "特生中心",
        role: "石虎野放前訓練夥伴",
        note: "協助石虎個體訓練、評估與野放準備。",
      },
      {
        name: "德國烏帕塔動物園",
        role: "雲豹合作來源",
        note: "透過國際物種交流，讓雲豹保育議題能在臺灣持續被看見。",
      },
    ],
    actions: [
      {
        title: "救傷與野放訓練",
        desc: "從石虎醫療、照養到野放前集訓，建立本土物種回歸野外的路徑。",
      },
      {
        title: "離島棲地教育推廣",
        desc: "透過金門水獺相關計畫，把物種保育與地方社會連結起來。",
      },
      {
        title: "展示轉化為保育溝通",
        desc: "讓雲豹、水獺與穿山甲等焦點物種成為公眾理解保育議題的入口。",
      },
    ],
    videoLinks: [
      {
        label: "響應『國際雲豹日』『Suki』近況報你知",
        url: "https://www.youtube.com/watch?v=t8Is1EUqaVc",
        note: "官方介紹雲豹 Suki 近況。",
      },
      {
        label: "響應世界穿山甲日臺北動物園推『護甲行動』",
        url: "https://www.youtube.com/watch?v=mg5ACTNP5xs",
        note: "從保育實務談穿山甲救傷與野放。",
      },
      {
        label: "金門小水獺通過健檢～個性成熟適應力良好",
        url: "https://www.youtube.com/watch?v=nydTeIuJkO8",
        note: "官方介紹水獺寶寶在園內照養情況。",
      },
    ],
    newsLinks: [
      {
        label: "金門水獺域內保育教育推廣",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=F18B015186A5F770&s=8B9DDFC1502F3123&sms=5B8197AA5783E7B9",
        year: "2024",
      },
      {
        label: "金門水獺保育大作戰",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=F18B015186A5F770&s=85F3B64255C101EB&sms=5B8197AA5783E7B9",
        year: "2021",
      },
      {
        label: "石虎救傷及野放紀實",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=F18B015186A5F770&s=F1FF5632215BE7F8&sms=5B8197AA5783E7B9",
        year: "2024",
      },
      {
        label: "石虎兄妹前往特生中心集訓",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=7295606B3AFA1C23&sms=72544237BBE4C5F6",
        year: "2023",
      },
      {
        label: "石虎三胞胎參與野放訓練",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=B99346A7BCDEF02C&sms=72544237BBE4C5F6",
        year: "2020",
      },
      {
        label: "德國烏帕塔動物園贈禮—雲豹來臺推展保育",
        url: "https://www.zoo.gov.taipei/ct.asp?ctNode=22735&mp=104031&xItem=245966778",
        year: "2016",
      },
      {
        label: "響應國際雲豹日：Suki 近況報你知",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=0B65B0E0A4C9E454&sms=72544237BBE4C5F6",
        year: "2021",
      },
      {
        label: "雲豹重返臺灣動物區和大家見面",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=F48F366797677017&sms=72544237BBE4C5F6",
        year: "2023",
      },
    ],
    species: [
      {
        name: "歐亞水獺",
        sci: "Lutra lutra",
        status: "近危 NT",
        statusClass: "bg-lime-100 text-lime-800",
        tags: ["金門棲地", "域內保育教育推廣"],
        summary: "金門的歐亞水獺保育工作連結離島棲地、水域環境與在地社會，是臺灣離島保育的重要案例。",
        role: "動物園透過照養、保育大使、教育推廣與在地合作，讓水獺保育更被社會理解。",
        relatedNewsLabels: ["金門水獺域內保育教育推廣", "金門水獺保育大作戰"],
      },
      {
        name: "穿山甲",
        sci: "Manis pentadactyla",
        status: "極危 CR",
        statusClass: "bg-rose-100 text-rose-800",
        tags: ["域外保育", "救傷醫療"],
        summary: "穿山甲是台北動物園長期投入救傷、醫療與域外保育的重要物種。",
        role: "動物園累積了穿山甲醫療與照養經驗，也成為國際合作的重要基礎。",
      },
      {
        name: "石虎",
        sci: "Prionailurus bengalensis",
        status: "瀕危 EN",
        statusClass: "bg-orange-100 text-orange-800",
        tags: ["野放訓練", "救傷收容"],
        summary: "石虎保育從救傷、照養到野放前訓練，呈現本土物種回歸野外的完整流程。",
        role: "動物園參與石虎醫療、照養與野放準備，並和外部保育單位協作。",
        relatedNewsLabels: ["石虎救傷及野放紀實", "石虎兄妹前往特生中心集訓", "石虎三胞胎參與野放訓練"],
      },
      {
        name: "雲豹",
        sci: "Neofelis nebulosa",
        status: "國際保育合作",
        statusClass: "bg-sky-100 text-sky-800",
        tags: ["德國烏帕塔動物園", "臺灣動物區"],
        summary: "雲豹在台北動物園的展示與照養，讓公眾能持續接觸這個亞洲森林中的重要貓科物種。",
        role: "動物園透過國際合作引入個體，並把展示空間轉化為保育溝通場域。",
        relatedNewsLabels: ["德國烏帕塔動物園贈禮—雲豹來臺推展保育", "響應國際雲豹日：Suki 近況報你知", "雲豹重返臺灣動物區和大家見面"],
      },
      {
        name: "臺灣黑熊",
        sci: "Ursus thibetanus formosanus",
        status: "域外保育",
        statusClass: "bg-amber-100 text-amber-800",
        tags: ["族群管理", "保育工作坊"],
        summary: "臺灣黑熊是臺灣山林保育的重要象徵物種，也常被納入保育教育與研究討論。",
        role: "動物園透過展示、教育與研究參與，協助大眾理解黑熊與棲地保育議題。",
      },
    ],
  },
  {
    id: "eastasia",
    label: "東亞",
    emoji: "🌏",
    title: "東亞保育合作",
    subtitle: "日本與區域夥伴交流",
    desc:
      "以日本高知 Noichi Zoo 與台日小貓熊保種合作為代表，呈現臺北市立動物園在亞洲區域內的專業交流、合作備忘錄、物種調度與保育夥伴關係。",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-900",
    icon: "🌏",
    summaryLabel: "區域合作",
    summaryColor: "bg-green-100 text-green-800",
    summarySpecies: "小貓熊",
    conservationTypes: ["國際合作", "域外保育"],
    animalGroups: ["哺乳類"],
    orgTags: ["JAZA"],
    partners: [
      {
        name: "日本高知 Noichi Zoo",
        role: "合作備忘錄夥伴",
        note: "建立亞洲區域內的照養、展示與保育交流關係。",
      },
      {
        name: "JAZA 協調網絡",
        role: "小貓熊保種協作",
        note: "台日小貓熊合作的重要協調背景。",
      },
    ],
    actions: [
      {
        title: "小貓熊保種合作",
        desc: "透過國際調度與協調，維持小貓熊域外族群的健康與多樣性。",
      },
      {
        title: "建立區域夥伴關係",
        desc: "以合作備忘錄與專業交流，強化動物園之間的長期協作。",
      },
    ],
    videoLinks: [
      {
        label: "竹林裡的小精靈～小貓熊受新訓練",
        url: "https://www.youtube.com/watch?v=k7G1yCMda6U",
        note: "介紹小貓熊的訓練與照養。",
      },
      {
        label: "9/20國際小貓熊日",
        url: "https://www.youtube.com/shorts/kDQBCiqoJFI",
        note: "官方短片介紹小貓熊與國際小貓熊日。",
      },
      {
        label: "小貓熊寶寶滿月－跟爸媽愈來愈像",
        url: "https://www.youtube.com/watch?v=EJUVc07tN70",
        note: "記錄小貓熊寶寶成長與照養。",
      },
    ],
    newsLinks: [
      {
        label: "台日小貓熊保種合作",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=E0159F1BC3487BED&sms=72544237BBE4C5F6",
        year: "2026",
      },
      {
        label: "高知野市動物園合作備忘錄",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=38AFC4B5A2D11A45",
        year: "2025",
      },
      {
        label: "國際小貓熊日相關新聞列表",
        url: "https://www.zoo.gov.taipei/News_Photo.aspx?PageSize=20&n=BD065B2FA7782989&page=4&sms=72544237BBE4C5F6",
        year: "2024",
      },
    ],
    species: [
      {
        name: "日本高知 Noichi Zoo",
        sci: "Partnership node",
        status: "合作 MOU",
        statusClass: "bg-emerald-100 text-emerald-800",
        tags: ["專業交流", "保育夥伴"],
      },
      {
        name: "小貓熊",
        sci: "Ailurus fulgens",
        status: "瀕危 EN",
        statusClass: "bg-orange-100 text-orange-800",
        tags: ["JAZA 協調", "台日保種"],
        summary: "小貓熊是東亞合作區中最具代表性的跨國保種物種，連結調度、照養與展示。",
        role: "動物園透過台日合作與國際協調，維持小貓熊域外族群的穩定。",
        relatedNewsLabels: ["台日小貓熊保種合作", "國際小貓熊日相關新聞列表"],
      },
      {
        name: "區域合作網絡",
        sci: "Regional network",
        status: "持續拓展",
        statusClass: "bg-slate-100 text-slate-700",
        tags: ["照養交流", "教育合作"],
      },
    ],
  },
  {
    id: "southeast",
    label: "東南亞",
    emoji: "🌴",
    title: "東南亞雨林保育",
    subtitle: "穿山甲、馬來虎與區域網絡",
    desc:
      "除了馬來虎，臺北市立動物園也透過 EAZA 穿山甲瀕危物種計畫、SEAZA 專業網絡，以及與新加坡萬態野生動物世界等機構的經驗交流，延伸東南亞物種的保育合作。",
    iconBg: "bg-amber-100",
    iconText: "text-amber-800",
    icon: "🦧",
    summaryLabel: "雨林保育",
    summaryColor: "bg-amber-100 text-amber-800",
    summarySpecies: "馬來熊",
    conservationTypes: ["域外保育", "國際合作", "教育推廣"],
    animalGroups: ["哺乳類"],
    orgTags: ["EAZA", "SEAZA"],
    partners: [
      {
        name: "SEAZA",
        role: "東南亞區域專業網絡",
        note: "串連東南亞動物園與水族館的專業交流與保育討論。",
      },
      {
        name: "EAZA Pangolin EEP",
        role: "穿山甲跨機構保種計畫",
        note: "讓域外保育從單一園所走向跨機構協作。",
      },
      {
        name: "新加坡萬態野生動物世界",
        role: "經驗交流夥伴",
        note: "作為東南亞區域中重要的動物保育與展示交流節點。",
      },
    ],
    actions: [
      {
        title: "推進穿山甲跨機構計畫",
        desc: "把穿山甲保育從個體照養延伸到跨園所的族群管理。",
      },
      {
        title: "深化東南亞專業網絡",
        desc: "透過 SEAZA 年會與交流，連結更多東南亞保育議題。",
      },
      {
        title: "兼顧動物福祉與保種",
        desc: "從馬來熊、馬來虎等物種經驗，累積展示與動福改善成果。",
      },
    ],
    videoLinks: [
      {
        label: "【稍微Zoo一下】馬來熊",
        url: "https://www.youtube.com/watch?v=6O2VM2CljnA",
        note: "以療癒短片方式近距離認識馬來熊。",
      },
      {
        label: "改善馬來熊姊弟的刻板行為～照養團隊有策略",
        url: "https://www.youtube.com/watch?v=MikcV3bGC6o",
        note: "官方說明馬來熊動物福祉改善策略。",
      },
      {
        label: "穿山甲 Formosan Pangolin 播放清單",
        url: "https://www.youtube.com/playlist?list=PLWYak5Af5-DsHAfWr5Bcsuds8hIKPJKIc",
        note: "整合穿山甲相關官方影片。",
      },
    ],
    newsLinks: [
      {
        label: "穿山甲瀕危物種計畫",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=F18B015186A5F770&s=F41FE7833C8B1EA2&sms=5B8197AA5783E7B9",
        year: "2024",
      },
      {
        label: "SEAZA 年會在臺灣舉行",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=81547E72A8FF6BF9&sms=72544237BBE4C5F6",
        year: "2024",
      },
      {
        label: "2022 SEAZA 峇里年會交流",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=F18B015186A5F770&s=E62D214A729A26CE&sms=5B8197AA5783E7B9",
        year: "2022",
      },
      {
        label: "建園 110 周年國際合作新聞",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=E55D4700EDBDA29B&sms=72544237BBE4C5F6",
        year: "2024",
      },
      {
        label: "馬來熊將啟程旅日",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=CB3DED4EFE3A31C2&sms=72544237BBE4C5F6",
        year: "2024",
      },
      {
        label: "改善馬來熊姊弟的刻板行為",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=DB52CFF3F214800D&sms=72544237BBE4C5F6",
        year: "2010",
      },
      {
        label: "小馬來熊為雨林請命",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=D59E08A3F537202C&sms=72544237BBE4C5F6",
        year: "2008",
      },
    ],
    species: [
      {
        name: "馬來虎",
        sci: "Panthera tigris jacksoni",
        status: "極危 CR",
        statusClass: "bg-rose-100 text-rose-800",
        tags: ["域外保種", "法國合作"],
        summary: "馬來虎是東南亞區的重要大型貓科物種，連結域外保種、展示與國際合作。",
        role: "動物園透過國際合作與照養管理，參與瀕危大型貓科的保種工作。",
      },
      {
        name: "穿山甲瀕危物種計畫",
        sci: "Pangolin EEP",
        status: "2024 成立",
        statusClass: "bg-teal-100 text-teal-800",
        tags: ["EAZA", "跨機構合作"],
        summary: "穿山甲瀕危物種計畫讓台北動物園的照養經驗與跨園所族群管理串接起來。",
        role: "動物園既是技術經驗的提供者，也是計畫實踐的重要節點。",
        relatedNewsLabels: ["穿山甲瀕危物種計畫"],
      },
      {
        name: "SEAZA 區域合作",
        sci: "SEAZA network",
        status: "專業網絡",
        statusClass: "bg-amber-100 text-amber-800",
        tags: ["東南亞", "動物福祉"],
      },
      {
        name: "馬來熊",
        sci: "Helarctos malayanus",
        status: "域外保種與動物福祉",
        statusClass: "bg-orange-100 text-orange-800",
        tags: ["旅日保種", "行為改善"],
        summary: "馬來熊保育同時涉及個體調度、雨林議題溝通與動物福祉改善。",
        role: "動物園透過照養與展示經驗，讓公眾理解雨林動物面臨的保育挑戰。",
        relatedNewsLabels: ["馬來熊將啟程旅日", "改善馬來熊姊弟的刻板行為", "小馬來熊為雨林請命"],
      },
    ],
  },
  {
    id: "africa",
    label: "非洲",
    emoji: "🌍",
    title: "非洲物種族群管理",
    subtitle: "收容、保種與國際網絡串接",
    desc:
      "野生動物收容中心長期協助收容查緝沒入的保育類野生動物，其中以龜類、蛇類和蜥蜴等爬蟲類為大宗，也持續與國際保育單位交流，讓收容動物得以連結域外衛星族群與保育合作。大猩猩家族的照養、親代行為與行為豐富化，也是此區的重要內容。",
    iconBg: "bg-orange-100",
    iconText: "text-orange-800",
    icon: "🦁",
    summaryLabel: "收容管理",
    summaryColor: "bg-orange-100 text-orange-800",
    summarySpecies: "大猩猩",
    conservationTypes: ["救傷", "域外保育", "教育推廣", "國際合作"],
    animalGroups: ["哺乳類", "爬蟲類"],
    orgTags: ["EAZA"],
    partners: [
      {
        name: "野生動物收容中心",
        role: "查緝沒入與收容核心",
        note: "連結政府執法、收容照養、物種鑑定與教育推廣。",
      },
      {
        name: "歐洲族群合作網絡",
        role: "大猩猩跨國合作背景",
        note: "支撐大猩猩個體調度、照養與家族管理的國際脈絡。",
      },
    ],
    actions: [
      {
        title: "收容保育類野生動物",
        desc: "接住查緝沒入個體，建立從收容到教育的支持體系。",
      },
      {
        title: "強化大猩猩家族照養",
        desc: "透過行為豐富化與親代觀察，展現靈長類照養與保育教育成果。",
      },
      {
        title: "讓收容議題被社會看見",
        desc: "把保育與執法、動福與公眾教育連成同一個敘事。",
      },
    ],
    videoLinks: [
      {
        label: "Gorilla Gorilla Gorilla 西部低地大猩猩",
        url: "https://www.youtube.com/watch?v=VpMCtBVtslE",
        note: "官方影片觀察大猩猩家族日常。",
      },
      {
        label: "世界大猩猩日 World Gorilla Day",
        url: "https://www.youtube.com/shorts/0hTDJIl5IpQ",
        note: "搭配保育日介紹迪亞哥一家。",
      },
    ],
    newsLinks: [
      {
        label: "野生動物收容中心介紹",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=07559E141D0D18C8&s=89CF09D959B35908&sms=3B5402F576088914",
        year: "2023",
      },
      {
        label: "侏儒河馬 Thabo 可愛亮相",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=FC23F4EA610EC51F&sms=72544237BBE4C5F6",
        year: "2024",
      },
      {
        label: "建園 110 周年國際合作新聞",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=E55D4700EDBDA29B&sms=72544237BBE4C5F6",
        year: "2024",
      },
      {
        label: "旅居荷蘭的大猩猩『寶寶』辭世",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=0B3D18D5307BB340&sms=72544237BBE4C5F6",
        year: "2024",
      },
      {
        label: "西部低地大猩猩兄弟兒童節獲得行豐玩具",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=F45150ADC3B031DF&sms=72544237BBE4C5F6",
        year: "2024",
      },
      {
        label: "金剛猩猩媽媽育兒態度大不同",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=66DB255604F7DF9E",
        year: "2024",
      },
    ],
    species: [
      {
        name: "野生動物收容中心",
        sci: "Wildlife Rescue & Confiscation",
        status: "1996 成立",
        statusClass: "bg-slate-100 text-slate-700",
        tags: ["查緝沒入", "跨機關合作"],
        summary: "野生動物收容中心讓查緝沒入的保育類野生動物有機會進入專業收容與照養系統。",
        role: "動物園整合執法、收容、照養與教育功能，讓收容工作不只是暫存，更是保育的一部分。",
        relatedNewsLabels: ["野生動物收容中心介紹"],
      },
      {
        name: "西部低地大猩猩",
        sci: "Gorilla gorilla gorilla",
        status: "家族照養與國際合作",
        statusClass: "bg-orange-100 text-orange-800",
        tags: ["行為豐富化", "親代照顧"],
        summary: "大猩猩家族的照養、繁殖與行為觀察，讓動物園能以更細膩的方式和公眾談靈長類保育。",
        role: "動物園透過家族照養、行為豐富化與展示教育，持續累積靈長類照養經驗。",
        relatedNewsLabels: ["旅居荷蘭的大猩猩『寶寶』辭世", "西部低地大猩猩兄弟兒童節獲得行豐玩具", "金剛猩猩媽媽育兒態度大不同"],
      },
      {
        name: "收容爬蟲與龜類",
        sci: "Reptiles & tortoises",
        status: "保育收容",
        statusClass: "bg-orange-100 text-orange-800",
        tags: ["物種鑑定", "教育推廣"],
      },
    ],
  },
  {
    id: "europe",
    label: "歐洲",
    emoji: "🇪🇺",
    title: "歐洲國際合作",
    subtitle: "布拉格、維也納與 EAZA 合作節點",
    desc:
      "從布拉格動物園穿山甲合作，到建園 110 周年與維也納動物園簽署保育合作備忘錄，再到 EAZA 正式會員資格，凸顯台北市立動物園在歐洲合作網絡中的技術輸出與夥伴角色。",
    iconBg: "bg-violet-100",
    iconText: "text-violet-800",
    icon: "🤝",
    summaryLabel: "EAZA 合作",
    summaryColor: "bg-violet-100 text-violet-800",
    summarySpecies: "穿山甲",
    conservationTypes: ["國際合作", "域外保育", "組織參與"],
    animalGroups: ["哺乳類"],
    orgTags: ["EAZA", "WAZA", "ZAA"],
    partners: [
      {
        name: "布拉格動物園",
        role: "穿山甲衛星族群與技術交流",
        note: "讓台北動物園的穿山甲照養經驗在歐洲延伸。",
      },
      {
        name: "維也納動物園",
        role: "合作備忘錄夥伴",
        note: "110 周年國際合作脈絡中的重要歐洲節點。",
      },
      {
        name: "EAZA",
        role: "歐洲協會正式成員體系",
        note: "支撐歐洲合作、物種調度與跨園所保育網絡。",
      },
    ],
    actions: [
      {
        title: "深化歐洲合作網絡",
        desc: "透過 EAZA 與歐洲園所合作，建立穩定的跨國交流關係。",
      },
      {
        title: "輸出穿山甲照養經驗",
        desc: "把台北動物園累積的照養與保育經驗轉化為國際合作能力。",
      },
      {
        title: "擴大跨區域保種合作",
        desc: "串連歐洲與北美資源，形成更完整的國際保種網絡。",
      },
    ],
    videoLinks: [
      {
        label: "世界穿山甲日！一起 Save the Pangolin",
        url: "https://www.youtube.com/watch?v=F-Iq-8aItiM",
        note: "與歐洲穿山甲保育合作主題相呼應。",
      },
      {
        label: "熱帶雨林區穿山甲館／Pangolin Dome 播放清單",
        url: "https://www.youtube.com/playlist?list=PLWYak5Af5-Dt82JV8gst_ZiAgo8-WS4_H",
        note: "以穿山甲館為核心的官方影片集合。",
      },
    ],
    newsLinks: [
      {
        label: "維也納／新加坡合作新聞",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=E55D4700EDBDA29B&sms=72544237BBE4C5F6",
        year: "2024",
      },
      {
        label: "穿山甲瀕危物種計畫",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=F18B015186A5F770&s=F41FE7833C8B1EA2&sms=5B8197AA5783E7B9",
        year: "2024",
      },
      {
        label: "2024 年大事紀（布拉格穿山甲寶寶）",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=6994C1D3233D329A&s=516FCFCB6F236A12",
        year: "2024",
      },
      {
        label: "AZA / EAZA 跨區域合作侏儒河馬",
        url: "https://www.zoo.gov.taipei/News_Content.aspx?n=BD065B2FA7782989&s=FC23F4EA610EC51F&sms=72544237BBE4C5F6",
        year: "2024",
      },
    ],
    species: [
      {
        name: "布拉格動物園",
        sci: "Prague Zoo",
        status: "穿山甲合作",
        statusClass: "bg-violet-100 text-violet-800",
        tags: ["衛星族群", "技術交流"],
      },
      {
        name: "維也納動物園",
        sci: "Vienna Zoo",
        status: "合作備忘錄",
        statusClass: "bg-sky-100 text-sky-800",
        tags: ["穿山甲合作", "110 周年"],
      },
      {
        name: "歐洲動物園暨水族館協會",
        sci: "EAZA",
        status: "正式成員",
        statusClass: "bg-orange-100 text-orange-800",
        tags: ["2018 審查通過", "國際交流"],
      },
    ],
  },
];

const mapDots: MapDot[] = [
  {
    id: "northamerica-aza",
    region: "northamerica",
    x: 18,
    y: 26,
    label: "AZA",
    color: "#3B82F6",
    size: 18,
    tooltipTitle: "北美 / AZA",
    tooltipSubtitle: "認證與跨區域合作",
  },
  {
    id: "taiwan-main",
    region: "taiwan",
    x: 80,
    y: 42,
    label: "臺",
    color: "#1D9E75",
    size: 18,
    tooltipTitle: "台灣本土",
    tooltipSubtitle: "石虎、水獺、雲豹",
  },
  {
    id: "eastasia-japan",
    region: "eastasia",
    x: 84,
    y: 28,
    label: "日",
    color: "#5DCAA5",
    size: 16,
    tooltipTitle: "東亞",
    tooltipSubtitle: "台日小貓熊合作",
  },
  {
    id: "eastasia-asia",
    region: "eastasia",
    x: 74,
    y: 32,
    label: "亞",
    color: "#5DCAA5",
    size: 16,
    tooltipTitle: "東亞",
    tooltipSubtitle: "高知合作備忘錄",
  },
  {
    id: "southeast-malaysia",
    region: "southeast",
    x: 72,
    y: 46,
    label: "馬",
    color: "#EF9F27",
    size: 18,
    tooltipTitle: "東南亞",
    tooltipSubtitle: "馬來虎、馬來熊與穿山甲計畫",
  },
  {
    id: "southeast-borneo",
    region: "southeast",
    x: 73,
    y: 53,
    label: "婆",
    color: "#EF9F27",
    size: 16,
    tooltipTitle: "東南亞",
    tooltipSubtitle: "SEAZA 區域網絡",
  },
  {
    id: "africa-node",
    region: "africa",
    x: 47,
    y: 42,
    label: "非",
    color: "#D85A30",
    size: 18,
    tooltipTitle: "非洲",
    tooltipSubtitle: "大猩猩與收容管理",
  },
  {
    id: "europe-node",
    region: "europe",
    x: 47,
    y: 20,
    label: "歐",
    color: "#7F77DD",
    size: 16,
    tooltipTitle: "歐洲",
    tooltipSubtitle: "EAZA 與布拉格合作",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getYouTubeEmbedData(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (!id) return null;
      return {
        type: "video" as const,
        embedUrl: `https://www.youtube.com/embed/${id}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        if (!id) return null;
        return {
          type: "video" as const,
          embedUrl: `https://www.youtube.com/embed/${id}`,
          thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        };
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/").filter(Boolean)[1];
        if (!id) return null;
        return {
          type: "video" as const,
          embedUrl: `https://www.youtube.com/embed/${id}`,
          thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        };
      }

      if (parsed.pathname === "/playlist") {
        const list = parsed.searchParams.get("list");
        if (!list) return null;
        return {
          type: "playlist" as const,
          embedUrl: `https://www.youtube.com/embed/videoseries?list=${list}`,
          thumbnailUrl: null,
        };
      }
    }
  } catch {
    return null;
  }

  return null;
}

function validateData() {
  const ids = new Set<string>();
  for (const region of regionsData) {
    if (ids.has(region.id)) {
      console.warn(`Duplicate region id: ${region.id}`);
    }
    ids.add(region.id);
    if (!region.newsLinks.length) {
      console.warn(`Region has no newsLinks: ${region.id}`);
    }
  }
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs transition-colors",
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      )}
    >
      {label}
    </button>
  );
}

function WorldMapPanel({
  activeRegion,
  onSelectRegion,
}: {
  activeRegion: RegionId;
  onSelectRegion: (region: RegionId) => void;
}) {
  const [hoveredDotId, setHoveredDotId] = useState<string | null>(null);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#f8fafc_0%,#eff6ff_50%,#f8fafc_100%)]">
        <svg viewBox="0 0 900 500" className="h-full w-full">
          <g opacity="0.9">
            <path d="M58 88 L95 70 L145 66 L188 72 L222 88 L238 114 L231 139 L213 156 L207 177 L187 193 L166 210 L137 220 L112 213 L89 196 L72 172 L59 147 L48 119 Z" fill="#D9D6CC" opacity="0.72" stroke="#CBD5E1" strokeWidth="1.2" />
            <path d="M191 42 L226 35 L254 45 L261 63 L244 77 L217 74 L194 60 Z" fill="#D9D6CC" opacity="0.6" stroke="#CBD5E1" strokeWidth="1.1" />
            <path d="M166 234 L194 229 L215 241 L225 263 L223 289 L214 321 L199 351 L180 372 L158 366 L146 342 L137 313 L139 286 L148 258 Z" fill="#D9D6CC" opacity="0.72" stroke="#CBD5E1" strokeWidth="1.2" />
            <path d="M374 66 L402 58 L435 58 L456 68 L469 82 L466 97 L447 108 L425 108 L404 99 L384 88 Z" fill="#D9D6CC" opacity="0.72" stroke="#CBD5E1" strokeWidth="1.2" />
            <path d="M404 118 L431 111 L456 115 L475 132 L485 158 L486 188 L478 220 L466 252 L446 279 L420 286 L399 266 L388 235 L381 202 L381 171 L388 141 Z" fill="#D9D6CC" opacity="0.72" stroke="#CBD5E1" strokeWidth="1.2" />
            <path d="M458 42 L506 33 L570 31 L632 38 L686 50 L712 67 L704 81 L665 90 L615 93 L566 91 L517 86 L478 75 Z" fill="#D9D6CC" opacity="0.6" stroke="#CBD5E1" strokeWidth="1.1" />
            <path d="M468 106 L500 101 L523 109 L534 123 L530 141 L507 150 L478 145 L460 130 Z" fill="#D9D6CC" opacity="0.62" stroke="#CBD5E1" strokeWidth="1.1" />
            <path d="M515 98 L560 95 L605 99 L640 111 L653 129 L648 145 L624 159 L588 165 L552 161 L523 151 L508 132 Z" fill="#D9D6CC" opacity="0.72" stroke="#CBD5E1" strokeWidth="1.2" />
            <path d="M607 157 L636 152 L666 158 L684 171 L686 188 L673 201 L648 207 L622 204 L602 190 L596 173 Z" fill="#D9D6CC" opacity="0.72" stroke="#CBD5E1" strokeWidth="1.2" />
            <path d="M614 214 L642 210 L674 214 L699 224 L710 238 L704 252 L677 257 L646 255 L620 245 L607 231 Z" fill="#D9D6CC" opacity="0.72" stroke="#CBD5E1" strokeWidth="1.2" />
            <path d="M646 92 L679 83 L720 81 L756 92 L774 110 L772 130 L758 146 L730 153 L694 150 L666 137 L647 118 Z" fill="#D9D6CC" opacity="0.72" stroke="#CBD5E1" strokeWidth="1.2" />
            <path d="M775 88 L791 84 L804 97 L803 114 L790 126 L777 118 L770 102 Z" fill="#D9D6CC" opacity="0.72" stroke="#CBD5E1" strokeWidth="1.1" />
            <path d="M680 293 L716 281 L760 282 L800 297 L817 323 L813 351 L791 376 L753 388 L714 380 L686 360 L673 331 Z" fill="#D9D6CC" opacity="0.72" stroke="#CBD5E1" strokeWidth="1.2" />
            <path d="M826 377 L843 383 L850 397 L841 408 L827 402 L821 390 Z" fill="#D9D6CC" opacity="0.58" stroke="#CBD5E1" strokeWidth="1" />
          </g>

          <text x="310" y="400" fill="#94A3B8" fontSize="12" textAnchor="middle" opacity="0.6">太平洋</text>
          <text x="120" y="380" fill="#94A3B8" fontSize="12" textAnchor="middle" opacity="0.6">大西洋</text>
          <text x="530" y="380" fill="#94A3B8" fontSize="12" textAnchor="middle" opacity="0.6">印度洋</text>

          {mapDots.map((dot) => {
            const isActive = activeRegion === "all" || activeRegion === dot.region;
            const isHovered = hoveredDotId === dot.id;
            const cx = dot.x * 9;
            const cy = dot.y * 5;
            return (
              <g
                key={dot.id}
                className="cursor-pointer"
                onClick={() => onSelectRegion(dot.region)}
                onMouseEnter={() => setHoveredDotId(dot.id)}
                onMouseLeave={() => setHoveredDotId(null)}
                style={{ opacity: isActive ? 1 : 0.28 }}
              >
                <circle cx={cx} cy={cy} r={dot.size} fill={dot.color} opacity="0.9" />
                <text
                  x={cx}
                  y={cy + 4}
                  fill={dot.region === "eastasia" ? "#04342C" : "white"}
                  fontSize="10"
                  textAnchor="middle"
                  fontWeight="700"
                >
                  {dot.label}
                </text>
                {isHovered && (
                  <g>
                    <rect x={cx - 58} y={cy - 48} width="116" height="34" rx="8" fill="white" stroke="#CBD5E1" strokeWidth="1" />
                    <text x={cx} y={cy - 33} fill="#0F172A" fontSize="10" textAnchor="middle" fontWeight="700">
                      {dot.tooltipTitle}
                    </text>
                    <text x={cx} y={cy - 20} fill="#64748B" fontSize="9" textAnchor="middle">
                      {dot.tooltipSubtitle}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          <rect x="25" y="346" width="220" height="138" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1" opacity="0.96" />
          <text x="38" y="370" fill="#0F172A" fontSize="12" fontWeight="600">圖例</text>
          <circle cx="42" cy="382" r="7" fill="#3B82F6" />
          <text x="55" y="386" fill="#475569" fontSize="11">北美 / AZA</text>
          <circle cx="42" cy="400" r="7" fill="#1D9E75" />
          <text x="55" y="404" fill="#475569" fontSize="11">台灣本土保育</text>
          <circle cx="42" cy="418" r="7" fill="#5DCAA5" />
          <text x="55" y="422" fill="#475569" fontSize="11">東亞合作</text>
          <circle cx="42" cy="436" r="7" fill="#EF9F27" />
          <text x="55" y="440" fill="#475569" fontSize="11">東南亞保育</text>
          <circle cx="42" cy="454" r="7" fill="#D85A30" />
          <text x="55" y="458" fill="#475569" fontSize="11">非洲族群管理</text>
          <circle cx="42" cy="472" r="7" fill="#7F77DD" />
          <text x="55" y="476" fill="#475569" fontSize="11">歐洲物種調度</text>
        </svg>
      </div>
    </div>
  );
}

function SpeciesCard({
  item,
  onClick,
  isSelected,
}: {
  item: SpeciesItem;
  onClick: () => void;
  isSelected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl p-4 text-left transition",
        isSelected ? "bg-slate-900 text-white" : "bg-slate-50 hover:bg-slate-100"
      )}
    >
      <div className={cn("text-xs italic", isSelected ? "text-slate-300" : "text-slate-500")}>{item.sci}</div>
      <div className={cn("mt-1 text-sm font-semibold", isSelected ? "text-white" : "text-slate-900")}>{item.name}</div>
      <span
        className={cn(
          "mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium",
          isSelected ? "bg-white/15 text-white" : item.statusClass
        )}
      >
        {item.status}
      </span>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px]",
              isSelected ? "border border-white/20 text-slate-200" : "border border-slate-200 text-slate-600"
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

function SpeciesDetailPanel({ item, region }: { item: SpeciesItem; region: RegionData }) {
  const relatedNews = region.newsLinks.filter((link) => item.relatedNewsLabels?.includes(link.label));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900">{item.name}</div>
          <div className="mt-1 text-sm italic text-slate-500">{item.sci}</div>
        </div>
        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium", item.statusClass)}>{item.status}</span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-xs font-medium text-slate-500">保育摘要</div>
          <div className="mt-2 text-sm leading-7 text-slate-700">{item.summary || "此物種的詳細摘要可持續擴充。"}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500">台北市立動物園角色</div>
          <div className="mt-2 text-sm leading-7 text-slate-700">{item.role || "持續投入照養、研究與保育推廣。"}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-medium text-slate-500">相關標籤</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-medium text-slate-500">對應官方新聞</div>
        <div className="mt-3 grid gap-2">
          {relatedNews.length > 0 ? (
            relatedNews.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                <span className="pr-4">{link.label}</span>
                <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
              </a>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
              這個物種目前尚未指定對應新聞，可後續補充。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RegionVideoSection({ region }: { region: RegionData }) {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  if (!region.videoLinks || region.videoLinks.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="mb-3 text-sm font-medium text-slate-900">相關影片</div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {region.videoLinks.map((video) => {
          const embed = getYouTubeEmbedData(video.url);
          const isActive = activeVideoUrl === video.url;
          return (
            <div key={video.url} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="aspect-video bg-slate-100">
                {embed && isActive ? (
                  <iframe
                    src={embed.embedUrl}
                    title={video.label}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : embed?.thumbnailUrl ? (
                  <button type="button" onClick={() => setActiveVideoUrl(video.url)} className="group relative h-full w-full">
                    <img src={embed.thumbnailUrl} alt={video.label} className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm">▶ 播放影片</div>
                    </div>
                  </button>
                ) : embed ? (
                  <button
                    type="button"
                    onClick={() => setActiveVideoUrl(video.url)}
                    className="flex h-full w-full items-center justify-center bg-slate-900/5 text-sm text-slate-600 hover:bg-slate-900/10"
                  >
                    ▶ 開啟播放清單
                  </button>
                ) : (
                  <a href={video.url} target="_blank" rel="noreferrer noopener" className="flex h-full items-center justify-center text-sm text-slate-500">
                    開啟 YouTube 影片
                  </a>
                )}
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold text-slate-900">{video.label}</div>
                <div className="mt-2 text-sm leading-7 text-slate-700">{video.note || "前往觀看官方影片"}</div>
                <div className="mt-3 flex items-center gap-3">
                  {!isActive && embed && (
                    <button type="button" onClick={() => setActiveVideoUrl(video.url)} className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900">
                      <span>在頁面中播放</span>
                    </button>
                  )}
                  <a href={video.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700">
                    <span>在 YouTube 開啟</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RegionFeatureSection({ region }: { region: RegionData }) {
  return (
    <div className="mt-6 space-y-6">
      {region.partners && region.partners.length > 0 && (
        <div>
          <div className="mb-3 text-sm font-medium text-slate-900">合作夥伴</div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {region.partners.map((partner) => (
              <div key={partner.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">{partner.name}</div>
                <div className="mt-1 text-xs text-slate-500">{partner.role}</div>
                <div className="mt-3 text-sm leading-7 text-slate-700">{partner.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {region.actions && region.actions.length > 0 && (
        <div>
          <div className="mb-3 text-sm font-medium text-slate-900">重點行動</div>
          <div className="grid gap-3 md:grid-cols-3">
            {region.actions.map((action) => (
              <div key={action.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">{action.title}</div>
                <div className="mt-2 text-sm leading-7 text-slate-700">{action.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeRegion, setActiveRegion] = useState<RegionId>("all");
  const [selectedSpeciesName, setSelectedSpeciesName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<ConservationType[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<AnimalGroup[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<OrgTag[]>([]);
  const [timelineExpanded, setTimelineExpanded] = useState(false);

  const orderedRegions = useMemo(() => {
    return regionOrder
      .map((id) => regionsData.find((item) => item.id === id))
      .filter((item): item is RegionData => Boolean(item));
  }, []);

  const filteredRegions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orderedRegions.filter((region) => {
      const haystack = [
        region.label,
        region.title,
        region.subtitle,
        region.desc,
        ...(region.species?.flatMap((item) => [item.name, item.sci, ...item.tags]) ?? []),
        ...(region.organizations?.flatMap((org) => [org.name, org.fullName, org.note]) ?? []),
        ...(region.partners?.flatMap((partner) => [partner.name, partner.role, partner.note]) ?? []),
        ...region.newsLinks.map((link) => link.label),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = !q || haystack.includes(q);
      const matchesTypes = selectedTypes.length === 0 || selectedTypes.some((type) => region.conservationTypes.includes(type));
      const matchesGroups = selectedGroups.length === 0 || selectedGroups.some((group) => region.animalGroups.includes(group));
      const matchesOrgs = selectedOrgs.length === 0 || selectedOrgs.some((org) => region.orgTags.includes(org));

      return matchesQuery && matchesTypes && matchesGroups && matchesOrgs;
    });
  }, [orderedRegions, searchQuery, selectedTypes, selectedGroups, selectedOrgs]);

  const activeData = useMemo(() => {
    const pool = filteredRegions.length > 0 ? filteredRegions : orderedRegions;
    return pool.find((item) => item.id === activeRegion) || pool[0];
  }, [activeRegion, filteredRegions, orderedRegions]);

  const timelineItems = useMemo(() => {
    if (!activeData) return [];
    return [...activeData.newsLinks].sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
  }, [activeData]);

  const recentUpdates = useMemo(() => {
    return [...regionsData]
      .flatMap((region) =>
        region.newsLinks.map((link) => ({
          ...link,
          regionLabel: region.label,
        }))
      )
      .sort((a, b) => Number(b.year || 0) - Number(a.year || 0))
      .slice(0, 6);
  }, []);

  const selectedSpecies = useMemo(() => {
    if (!activeData?.species?.length) return null;
    return activeData.species.find((item) => item.name === selectedSpeciesName) || activeData.species[0];
  }, [activeData, selectedSpeciesName]);

  useEffect(() => {
    validateData();
  }, []);

  useEffect(() => {
    const availableIds = new Set(filteredRegions.map((region) => region.id));
    if (filteredRegions.length > 0 && !availableIds.has(activeRegion)) {
      setActiveRegion(filteredRegions[0].id);
    }
    if (filteredRegions.length === 0) {
      setActiveRegion("all");
    }
  }, [filteredRegions, activeRegion]);

  useEffect(() => {
    if (activeData?.species?.length) {
      setSelectedSpeciesName((prev) => {
        const exists = activeData.species?.some((item) => item.name === prev);
        return exists ? prev : activeData.species[0].name;
      });
    } else {
      setSelectedSpeciesName(null);
    }
  }, [activeData]);

  const toggleType = (value: ConservationType) => {
    setSelectedTypes((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const toggleGroup = (value: AnimalGroup) => {
    setSelectedGroups((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const toggleOrg = (value: OrgTag) => {
    setSelectedOrgs((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTypes([]);
    setSelectedGroups([]);
    setSelectedOrgs([]);
    setActiveRegion("all");
  };

  if (!activeData) return null;

  const displayedTimeline = timelineExpanded ? timelineItems : timelineItems.slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-[22px] font-medium text-slate-900">🌏 臺北市立動物園 · 全球保育地圖</div>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              臺北市立動物園長期投入臺灣本土物種保育、野生動物救傷、域外保種、國際合作與環境教育，並透過研究、照養管理、跨機構夥伴關係與公眾溝通，持續擴大保育工作的影響力。這張地圖整理了動物園在不同區域的保育行動與合作脈絡，從臺灣本島、離島棲地到亞洲、歐洲與北美的國際網絡，帶你看見每一項保育工作如何與物種、棲地及社會連結。
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-2 text-sm font-medium text-slate-900">全站搜尋</div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜尋物種、組織、區域或新聞標題"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-10 py-3 outline-none focus:border-slate-400"
                  />
                </div>
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="text-xs text-slate-500">目前符合條件區域：{filteredRegions.length}</div>
                <button onClick={resetFilters} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  清除篩選
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="mb-2 text-xs font-medium text-slate-500">保育類型</div>
                <div className="flex flex-wrap gap-2">
                  {conservationTypeOptions.map((item) => (
                    <FilterChip key={item} active={selectedTypes.includes(item)} label={item} onClick={() => toggleType(item)} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-medium text-slate-500">動物類群</div>
                <div className="flex flex-wrap gap-2">
                  {animalGroupOptions.map((item) => (
                    <FilterChip key={item} active={selectedGroups.includes(item)} label={item} onClick={() => toggleGroup(item)} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-medium text-slate-500">合作組織</div>
                <div className="flex flex-wrap gap-2">
                  {orgTagOptions.map((item) => (
                    <FilterChip key={item} active={selectedOrgs.includes(item)} label={item} onClick={() => toggleOrg(item)} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {filteredRegions.map((region) => (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region.id)}
                className={cn(
                  "inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  activeRegion === region.id
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span>{region.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-6 lg:px-8">
        <WorldMapPanel activeRegion={activeRegion} onSelectRegion={setActiveRegion} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 bg-white shadow-none">
          <div className="p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl", activeData.iconBg, activeData.iconText)}>
                {activeData.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xl font-medium text-slate-900">{activeData.title}</div>
                <div className="mt-1 text-sm text-slate-500">{activeData.subtitle}</div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">{activeData.desc}</p>

            {activeData.id === "all" ? (
              <div className="mt-5 space-y-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  {activeData.stats?.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-slate-50 p-4 text-center">
                      <div className="text-2xl font-medium text-slate-900">{stat.value}</div>
                      <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="mb-3 text-sm font-medium text-slate-900">最近更新</div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {recentUpdates.map((item) => (
                      <a
                        key={`${item.regionLabel}-${item.url}`}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">{item.regionLabel}</span>
                          <span className="text-[11px] text-slate-500">{item.year || "未標示"}</span>
                        </div>
                        <div className="mt-3 text-sm font-medium text-slate-900">{item.label}</div>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 text-sm font-medium text-slate-900">區域摘要</div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {orderedRegions
                      .filter((region) => region.id !== "all")
                      .map((region) => (
                        <button
                          key={region.id}
                          onClick={() => setActiveRegion(region.id)}
                          className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{region.label}</div>
                              <div className="mt-1 text-xs text-slate-500">{region.subtitle}</div>
                            </div>
                            <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", region.summaryColor || "bg-slate-100 text-slate-700")}>
                              {region.summaryLabel || "保育主題"}
                            </span>
                          </div>
                          <div className="mt-4 text-xs text-slate-500">代表物種</div>
                          <div className="mt-1 text-sm font-medium text-slate-800">{region.summarySpecies || "持續擴充中"}</div>
                        </button>
                      ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 text-sm font-medium text-slate-900">目前參與的國際組織</div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {activeData.organizations?.map((org) => (
                      <div key={org.name} className={cn("rounded-2xl border p-4", org.tone)}>
                        <div className="text-sm font-semibold">{org.name}</div>
                        <div className="mt-1 text-xs opacity-80">{org.fullName}</div>
                        <div className="mt-3 text-xs leading-6 opacity-90">{org.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <RegionFeatureSection region={activeData} />
                <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.05fr]">
                  <div className="grid gap-3 md:grid-cols-2">
                    {activeData.species?.map((item) => (
                      <SpeciesCard
                        key={item.name}
                        item={item}
                        onClick={() => setSelectedSpeciesName(item.name)}
                        isSelected={selectedSpecies?.name === item.name}
                      />
                    ))}
                  </div>
                  {selectedSpecies ? <SpeciesDetailPanel item={selectedSpecies} region={activeData} /> : null}
                </div>
                <RegionVideoSection region={activeData} />
              </div>
            )}

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-slate-900">新聞時間軸</div>
                {timelineItems.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setTimelineExpanded((prev) => !prev)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {timelineExpanded ? "收合" : "展開全部"}
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {displayedTimeline.map((link, index) => (
                  <div key={link.url} className="flex gap-3">
                    <div className="flex w-14 flex-col items-center">
                      <div className="rounded-full bg-slate-900 px-2 py-1 text-[11px] font-medium text-white">{link.year || "年份未標示"}</div>
                      {index !== displayedTimeline.length - 1 && <div className="mt-2 h-full w-px bg-slate-200" />}
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex min-h-[52px] flex-1 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <span className="pr-4">{link.label}</span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Landmark,
              title: "更接近參考網站的動線",
              text: "先看地圖，再閱讀單一卡片內容，閱讀重心更集中。",
            },
            {
              icon: Globe,
              title: "保留新聞連結功能",
              text: "每一區都可以直接外連到相關官方新聞或保育報導。",
            },
            {
              icon: ShieldCheck,
              title: "方便後續補真實資料",
              text: "之後可再補更多物種卡、照片、子頁面與合作成果指標。",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white shadow-none">
                <div className="p-5">
                  <div className="mb-3 inline-flex rounded-2xl bg-slate-100 p-3">
                    <Icon className="h-5 w-5 text-slate-700" />
                  </div>
                  <div className="text-base font-semibold text-slate-900">{item.title}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-600">{item.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
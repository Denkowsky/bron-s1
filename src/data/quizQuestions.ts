export type QuizCategory = "UoBiA" | "Bezpieczeństwo" | "Regulamin PZSS" | "Kodeks Karny";

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
  legalBasis: string;
  explanation: string;
}

/**
 * Próbka 15 pytań w stylu egzaminu na patent PZSS.
 * To nie jest oficjalny zestaw Komisji Licencyjno-Patentowej.
 * Podstawy: t.j. Dz.U. 2024 poz. 485 oraz Regulamin patentu PZSS (2025), § 19.
 */
export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: "uobia-organ",
    category: "UoBiA",
    question: "Właściwym organem Policji do wydania pozwolenia na broń osobie fizycznej jest:",
    options: [
      "Komendant powiatowy Policji właściwy dla miejsca zameldowania",
      "Komendant wojewódzki Policji właściwy ze względu na miejsce stałego pobytu, a w Warszawie Komendant Stołeczny Policji",
      "Komendant Główny Policji, niezależnie od miejsca pobytu wnioskodawcy",
    ],
    correctIndex: 1,
    legalBasis: "Art. 9 ust. 1 UoBiA",
    explanation:
      "Pozwolenie wydaje komendant wojewódzki Policji właściwy dla miejsca stałego pobytu. Na obszarze Warszawy organem tym jest Komendant Stołeczny Policji, a nie komendant powiatowy ani Komendant Główny.",
  },
  {
    id: "uobia-wiek",
    category: "UoBiA",
    question: "Pozwolenia na broń co do zasady nie wydaje się osobie, która nie ma ukończonych 21 lat. Wyjątek dotyczy:",
    options: [
      "każdej osoby od 18. roku życia, jeżeli ma zaświadczenie od lekarza sportowego",
      "osoby od 18. roku życia, ale tylko na broń do celów sportowych lub łowieckich i na wniosek szkoły, organizacji sportowej, PZŁ albo stowarzyszenia obronnego",
      "wyłącznie żołnierzy zawodowych, niezależnie od wieku",
    ],
    correctIndex: 1,
    legalBasis: "Art. 15 ust. 1 pkt 1 i ust. 2 UoBiA",
    explanation:
      "Próg wieku to 21 lat. Organ może wydać pozwolenie osobie, która ukończyła 18 lat, wyłącznie na broń sportową lub łowiecką i tylko na wniosek wskazanych w ustawie podmiotów.",
  },
  {
    id: "uobia-sport",
    category: "UoBiA",
    question:
      "Ważną przyczynę posiadania broni do celów sportowych dokumentuje się w szczególności przez:",
    options: [
      "sam patent strzelecki, bez członkostwa w klubie i bez licencji",
      "członkostwo w stowarzyszeniu strzeleckim, kwalifikacje sportowe z art. 10b UoBiA oraz licencję właściwego polskiego związku sportowego",
      "zaświadczenie z koła łowieckiego i zdany egzamin PZŁ",
    ],
    correctIndex: 1,
    legalBasis: "Art. 10 ust. 3 UoBiA",
    explanation:
      "Do celu sportowego potrzebne są trzy elementy łącznie: klub, patent (kwalifikacje z art. 10b) i licencja związku sportowego. Sam patent albo uprawnienia łowieckie tego wymogu nie zastępują.",
  },
  {
    id: "uobia-rejestracja",
    category: "UoBiA",
    question: "Nabywca broni wymagającej pozwolenia rejestruje ją:",
    options: [
      "w ciągu 5 dni od dnia nabycia, u organu właściwego do wydawania pozwoleń",
      "w ciągu 14 dni od dnia nabycia, w dowolnej jednostce Policji",
      "dopiero przy najbliższej kontroli przechowywania broni",
    ],
    correctIndex: 0,
    legalBasis: "Art. 13 ust. 1 i 3 UoBiA",
    explanation:
      "Termin rejestracji to 5 dni od nabycia. Rejestracji dokonuje organ właściwy do wydania pozwolenia, na podstawie dowodu nabycia. Brak rejestracji jest podstawą do odmowy albo cofnięcia pozwolenia.",
  },
  {
    id: "uobia-s1",
    category: "UoBiA",
    question:
      "Osoba przechowująca broń palną na podstawie pozwolenia, o którym mowa w art. 10 ust. 4 UoBiA, trzyma broń i amunicję:",
    options: [
      "w dowolnej zamykanej szafie metalowej, byle z zamkiem kluczowym",
      "w urządzeniu spełniającym wymagania co najmniej klasy S1 według normy PN-EN 14450",
      "wyłącznie w pomieszczeniu z kratami, niezależnie od liczby egzemplarzy",
    ],
    correctIndex: 1,
    legalBasis: "Art. 32 ust. 1 UoBiA; § 5 ust. 1 rozp. w sprawie przechowywania broni",
    explanation:
      "Ustawa wymaga przechowywania broni i amunicji tak, aby nie miały do nich dostępu osoby nieuprawnione. Rozporządzenie doprecyzowuje to jako urządzenie co najmniej klasy S1. Dodatkowe wymogi pomieszczenia dotyczą zbiorów powyżej 50 egzemplarzy.",
  },
  {
    id: "uobia-utrata",
    category: "UoBiA",
    question: "Po stwierdzeniu utraty broni posiadacz zawiadamia Policję albo Żandarmerię Wojskową:",
    options: [
      "niezwłocznie, nie później niż w ciągu 24 godzin",
      "w ciągu 5 dni, tak jak przy rejestracji nabycia",
      "przy najbliższym odnowieniu badań lekarskich",
    ],
    correctIndex: 0,
    legalBasis: "Art. 25 UoBiA",
    explanation:
      "Utrata broni wymaga zawiadomienia niezwłocznie, a najpóźniej w 24 godziny od jej stwierdzenia. Pięciodniowy termin dotyczy rejestracji nabycia, a nie utraty.",
  },
  {
    id: "uobia-noszenie",
    category: "UoBiA",
    question: "Noszenie broni w rozumieniu ustawy o broni i amunicji oznacza:",
    options: [
      "każde przemieszczanie broni, także rozładowanej i w futerale",
      "każdy sposób przemieszczania załadowanej broni przez osobę, która ją posiada",
      "wyłącznie trzymanie broni w dłoni na strzelnicy",
    ],
    correctIndex: 1,
    legalBasis: "Art. 10 ust. 9 UoBiA",
    explanation:
      "O noszeniu decyduje to, że broń jest załadowana. Przemieszczanie broni rozładowanej nie jest noszeniem w znaczeniu ustawowym. Zgoda na noszenie broni kolekcjonerskiej i pamiątkowej jest osobno ograniczona.",
  },
  {
    id: "bezp-zaladowana",
    category: "Bezpieczeństwo",
    question: "Po wzięciu broni do ręki na strzelnicy, zanim wykonasz inną czynność, powinieneś:",
    options: [
      "przyjąć, że broń jest rozładowana, jeżeli nie ma w niej magazynka",
      "skierować lufę w kulochwyt i sam sprawdzić komorę nabojową oraz magazynek",
      "odłożyć broń lufą w stronę sąsiedniego stanowiska, żeby nie celować w tarczę",
    ],
    correctIndex: 1,
    legalBasis: "§ 25 Regulaminu patentu PZSS; zasady bezpieczeństwa na strzelnicy",
    explanation:
      "Każdą broń traktuje się jako załadowaną, dopóki sam nie sprawdzisz komory i magazynka. Sam brak magazynka nie rozładowuje naboju, który mógł zostać w komorze. Lufa pozostaje skierowana w kulochwyt.",
  },
  {
    id: "bezp-stop",
    category: "Bezpieczeństwo",
    question: "Na komendę prowadzącego strzelanie „Przerwij ogień” zawodnik natychmiast:",
    options: [
      "oddaje ostatni celny strzał, a dopiero potem zabezpiecza broń",
      "przerywa ogień, zdejmuje palec ze spustu, kieruje lufę w kulochwyt i czeka na dalszą komendę",
      "odwraca się z bronią do prowadzącego i pyta o powód przerwania",
    ],
    correctIndex: 1,
    legalBasis: "Zasady bezpieczeństwa na strzelnicy; komendy prowadzącego strzelanie",
    explanation:
      "„Przerwij ogień” kończy strzelanie w tym momencie. Nie dokańcza się serii i nie obraca się z bronią w stronę ludzi. Rozładowanie następuje dopiero na osobną komendę.",
  },
  {
    id: "bezp-spust",
    category: "Bezpieczeństwo",
    question: "Palec wolno położyć na języku spustowym:",
    options: [
      "od momentu załadowania broni, żeby skrócić czas pierwszego strzału",
      "dopiero gdy przyrządy są na celu i podjęta jest decyzja o strzale",
      "przez cały czas pozostawania na stanowisku, jeżeli broń jest zabezpieczona",
    ],
    correctIndex: 1,
    legalBasis: "Zasady bezpieczeństwa przy posługiwaniu się bronią palną",
    explanation:
      "Poza chwilą celnego strzału palec pozostaje poza kabłąkiem, wzdłuż szkieletu. Zabezpieczenie nie zastępuje tej zasady, bo można je zwolnić odruchowo.",
  },
  {
    id: "bezp-lufa",
    category: "Bezpieczeństwo",
    question: "Podczas ładowania, rozładowania i odkładania broni na stanowisku lufa jest skierowana:",
    options: [
      "w kulochwyt albo inne urządzenie zatrzymujące pocisk",
      "pionowo w górę, bo wtedy rykoszet nie trafi w tarczę",
      "w stronę podłogi za linią stanowisk, żeby nie zużyć kulochwytu",
    ],
    correctIndex: 0,
    legalBasis: "Zasady bezpieczeństwa na strzelnicy",
    explanation:
      "Bezpieczny kierunek na stanowisku to kulochwyt. Lufa w sufit, w podłogę za linią albo w sąsiednie stanowisko jest naruszeniem zasad, także przy broni uznanej za rozładowaną.",
  },
  {
    id: "pzss-prog",
    category: "Regulamin PZSS",
    question: "Teoretyczna część egzaminu na patent strzelecki jest zaliczona, gdy zdający:",
    options: [
      "odpowie poprawnie na co najmniej 9 z 10 pytań, w tym bezbłędnie na pierwsze 4 z UoBiA i bezpieczeństwa, w czasie 20 minut",
      "uzyska co najmniej 70% i może pomylić się w pytaniach z ustawy, jeżeli reszta jest poprawna",
      "rozwiąże 15 pytań w 15 minut, z dowolną liczbą błędów w części prawnej",
    ],
    correctIndex: 0,
    legalBasis: "§ 19 ust. 5–7 Regulaminu patentu PZSS",
    explanation:
      "Test ma 10 pytań i 20 minut. Próg to minimum 9 poprawnych odpowiedzi. Jedna pomyłka w pierwszych czterech pytaniach, z ustawy i bezpieczeństwa, oblewa całą część teoretyczną.",
  },
  {
    id: "pzss-klp",
    category: "Regulamin PZSS",
    question: "Patent strzelecki, potwierdzający kwalifikacje z art. 10b ust. 2 UoBiA, nadaje:",
    options: [
      "prowadzący strzelanie w klubie macierzystym, wpisem do książki strzelań",
      "Komendant wojewódzki Policji razem z pozwoleniem na broń",
      "Komisja Licencyjno-Patentowa PZSS, w drodze orzeczenia",
    ],
    correctIndex: 2,
    legalBasis: "§ 3 ust. 1 i 2 Regulaminu patentu PZSS",
    explanation:
      "Patent nadaje, zawiesza i cofa KLP PZSS. Policja wydaje pozwolenie na broń i patentu nie zastępuje. Wpis klubowy nie jest dokumentem nadania patentu.",
  },
  {
    id: "kk-obrona",
    category: "Kodeks Karny",
    question: "Nie popełnia przestępstwa, kto:",
    options: [
      "w obronie koniecznej odpiera bezpośredni, bezprawny zamach na jakiekolwiek dobro chronione prawem",
      "używa broni wobec osoby, która wcześniej groziła mu słownie, choć zamach już ustał",
      "strzela do uciekającego sprawcy kradzieży, żeby odzyskać mienie",
    ],
    correctIndex: 0,
    legalBasis: "Art. 25 § 1 KK",
    explanation:
      "Obronę konieczną wyłącza dopiero bezpośredni i bezprawny zamach. Gdy zamach ustał albo sprawca ucieka, nie ma już odpierania zamachu. Przekroczenie granic obrony ocenia się osobno, na podstawie art. 25 § 2 i 3 KK.",
  },
  {
    id: "kk-263",
    category: "Kodeks Karny",
    question: "Kto bez wymaganego zezwolenia posiada broń palną lub amunicję:",
    options: [
      "popełnia wykroczenie zagrożone grzywną",
      "podlega karze pozbawienia wolności od 6 miesięcy do lat 8",
      "odpowiada tylko dyscyplinarnie przed PZSS, jeżeli ma patent",
    ],
    correctIndex: 1,
    legalBasis: "Art. 263 § 2 KK",
    explanation:
      "Posiadanie broni palnej lub amunicji bez wymaganego pozwolenia jest przestępstwem z art. 263 § 2 KK, zagrożonym karą od 6 miesięcy do 8 lat pozbawienia wolności. Patent klubowy tego pozwolenia nie zastępuje.",
  },
];

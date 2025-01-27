// For tailwind to work properly, the color classes shouldnt be constructed dynamically

export interface ColorAwarenessInfo {
  id: string;
  bgClass: string;
  textClass: string;
  bgSelectionClass: string;
}

export const getAwarenessColor = (
  colorId: string
): ColorAwarenessInfo | undefined => {
  return awarenessColors.find((color) => color.id === colorId);
};

// https://tailwindcss.com/docs/content-configuration#dynamic-class-names
export const awarenessColors: ColorAwarenessInfo[] = [
  {
    id: 'red',
    bgClass: 'bg-red-300',
    textClass: 'text-red-300',
    bgSelectionClass: 'bg-red-200'
  },
  {
    id: 'orange',
    bgClass: 'bg-orange-300',
    textClass: 'text-orange-300',
    bgSelectionClass: 'bg-orange-200'
  },
  {
    id: 'amber',
    bgClass: 'bg-amber-300',
    textClass: 'text-amber-300',
    bgSelectionClass: 'bg-amber-200'
  },
  {
    id: 'yellow',
    bgClass: 'bg-yellow-300',
    textClass: 'text-yellow-300',
    bgSelectionClass: 'bg-yellow-200'
  },
  {
    id: 'lime',
    bgClass: 'bg-lime-300',
    textClass: 'text-lime-300',
    bgSelectionClass: 'bg-lime-200'
  },
  {
    id: 'green',
    bgClass: 'bg-green-300',
    textClass: 'text-green-300',
    bgSelectionClass: 'bg-green-200'
  },
  {
    id: 'emerald',
    bgClass: 'bg-emerald-300',
    textClass: 'text-emerald-300',
    bgSelectionClass: 'bg-emerald-200'
  },
  {
    id: 'teal',
    bgClass: 'bg-teal-300',
    textClass: 'text-teal-300',
    bgSelectionClass: 'bg-teal-200'
  },
  {
    id: 'cyan',
    bgClass: 'bg-cyan-300',
    textClass: 'text-cyan-300',
    bgSelectionClass: 'bg-cyan-200'
  },
  {
    id: 'sky',
    bgClass: 'bg-sky-300',
    textClass: 'text-sky-300',
    bgSelectionClass: 'bg-sky-200'
  },
  {
    id: 'blue',
    bgClass: 'bg-blue-300',
    textClass: 'text-blue-300',
    bgSelectionClass: 'bg-blue-200'
  },
  {
    id: 'indigo',
    bgClass: 'bg-indigo-300',
    textClass: 'text-indigo-300',
    bgSelectionClass: 'bg-indigo-200'
  },
  {
    id: 'violet',
    bgClass: 'bg-violet-300',
    textClass: 'text-violet-300',
    bgSelectionClass: 'bg-violet-200'
  },
  {
    id: 'purple',
    bgClass: 'bg-purple-300',
    textClass: 'text-purple-300',
    bgSelectionClass: 'bg-purple-200'
  },
  {
    id: 'fuchsia',
    bgClass: 'bg-fuchsia-300',
    textClass: 'text-fuchsia-300',
    bgSelectionClass: 'bg-fuchsia-200'
  },
  {
    id: 'pink',
    bgClass: 'bg-pink-300',
    textClass: 'text-pink-300',
    bgSelectionClass: 'bg-pink-200'
  },
  {
    id: 'rose',
    bgClass: 'bg-rose-300',
    textClass: 'text-rose-300',
    bgSelectionClass: 'bg-rose-200'
  }
];

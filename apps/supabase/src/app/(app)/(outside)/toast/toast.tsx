"use client"
import { CheckIcon, LoadingCircle, toast } from "@suzu/ui"
import Link from "next/link"

type Icons = {
  loadingIcon?: React.ReactNode
  checkIcon?: React.ReactNode
}

const icons = (): Icons => {
  return {
    loadingIcon: <LoadingCircle />,
    checkIcon: <CheckIcon />
  }
}

type ConfigToast = {
  unstyled: boolean,
  icon?: React.ReactNode;
  duration: number;
  action?: React.ReactNode;
  classNames: {
    toast: string;
    title?: string;
  }
}

/**
 * iconR stands for icon real
 * @param iconR 
 * returs
 */
const getIcon = (iconR: string): React.ReactNode => {
  const iconList = icons();
  switch (iconR) {
    case 'loadingIcon':
      return iconList.loadingIcon;
    case 'checkIcon':
      return iconList.checkIcon;
  }
}

export const toastFeed = (mess: string, iconR?: string, actMess?: string, link?: string) => {

  const config: ConfigToast = {
    unstyled: true,
    duration: 300,
    classNames: {
      toast: 'flex h-12 max-w-[358px] rounded-[8px] items-center relative px-4'
    }
  }

  if (actMess) {
    const action = <Link href={`${link}`} role="button" className="absolute right-4">{actMess}</Link>;
    config.action = action;
  }

  if (iconR) {
    config.classNames.title = 'pl-5';
    config.icon = getIcon(iconR);
  }

  toast(
    mess,
    config
  )
}
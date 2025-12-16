import { LucideIcon } from 'lucide-react'
import React from 'react'

type MenuItemProps = {
  icon?: React.ElementType
  title?: string
  action?: () => void
  isActive?: () => boolean
}

const MenuItem = ({
  icon: Icon, title, action, isActive = () => false,
}: MenuItemProps) => {
  return (
    <button
      className={`menu-item${isActive && isActive() ? ' is-active' : ''}`}
      onClick={action}
      title={title}
    >
      {Icon && <Icon />}
    </button>
  )
}

export default MenuItem
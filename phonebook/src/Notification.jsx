const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const notificationClass = notification.type === 'success' ? 'success' : 'error'
  
  return (
    <div className={notificationClass}>
      {notification.message}
    </div>
  )
}

export default Notification
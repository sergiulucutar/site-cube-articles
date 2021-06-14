class Detector {
  isDesktop () {
    if (!this.isDesktopChecked) {
      this.isDesktopChecked = true

      this.isDesktopDevice = document.documentElement.getAttribute('data-device') === 'desktop'
    }

    return this.isDesktopDevice
  }

  isPhone () {
    if (!this.isPhoneChecked) {
      this.isPhoneChecked = true

      this.isPhoneDevice = document.documentElement.getAttribute('data-device') === 'mobile'
    }

    return this.isPhoneDevice
  }

  isTablet () {
    if (!this.isTabletChecked) {
      this.isTabletChecked = true

      this.isTabletDevice = document.documentElement.getAttribute('data-device') === 'tablet'
    }

    return this.isTabletDevice
  }
}

const DeviceDetector = new Detector()
export default DeviceDetector

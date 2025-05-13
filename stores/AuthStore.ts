import { makeAutoObservable } from 'mobx'
import Cookies from 'js-cookie'

export class AuthStore {
  accessToken: string | null = null
  refreshToken: string | null = null
  isRefreshing = false
  refreshTimer: NodeJS.Timeout | null = null
  refreshError: string | null = null
  userID: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  syncFromBrowser() {
    this.accessToken = Cookies.get('accessToken') || null
    this.refreshToken = Cookies.get('refreshToken') || null
    this.userID = Cookies.get('userID') || null
  }

  setAccessToken(a_token: string) {
    if (!a_token) throw new Error('Invalid access token')

    this.accessToken = a_token

    Cookies.set('accessToken', a_token, {
      secure: false,
      sameSite: 'Lax'
    })
  }

  setRefreshToken(r_token: string) {
    if (!r_token) throw new Error('Invalid refresh token')

    this.refreshToken = r_token

    Cookies.set('refreshToken', r_token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: false,
      sameSite: 'Lax'
    })
  }
  setUserID(userID: string) {
    if (!userID) throw new Error('Invalid refresh token')

    this.userID = userID

    Cookies.set('userID', userID, {
      secure: false,
      sameSite: 'Lax'
    })
  }

  login(a_token: string, r_token: string, userID: string) {
    this.setAccessToken(a_token)
    this.setRefreshToken(r_token)
    this.setUserID(userID);
  }

  logout() {
    this.accessToken = null
    this.refreshToken = null
    this.userID = null;
    this.isRefreshing = false

    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('userID')
  }

  async handleRefresh() {
    try {
      this.isRefreshing = true;
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: this.refreshToken })
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      this.login(data.accessToken, data.refreshToken, data.userID);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }
}
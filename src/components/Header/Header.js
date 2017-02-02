import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'

export const Header = () => (
  <div className="lls_header">
    <div className="lls_header-backLink">
        <Link to='#' className="lls_header-link lls_header-backLink">
            Mes classes
        </Link> 
    </div>
    <h1 className="lls_header-title">3&egrave;me Victor Hugo</h1>
    <div className="lls_header-tabs">
        <IndexLink to='/' activeClassName='lls_header-tabLink--active' className="lls_header-link lls_header-tabLink">
          Dans la classe
        </IndexLink>
        <Link to='#' className="lls_header-link lls_header-tabLink">
            Devoirs
        </Link>
        <Link to='#' className="lls_header-link lls_header-tabLink">
            Mur de la classe
        </Link>
    </div>
  </div>
)

export default Header

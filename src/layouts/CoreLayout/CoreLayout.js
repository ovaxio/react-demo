import React from 'react'
import Header from '../../components/Header'
import './CoreLayout.scss'
import '../../styles/core.scss'

export class CoreLayout extends React.Component {

    render = () => {
        return (   
          <div>
            <Header />
            <div className='core-layout__viewport'>
              {this.props.children}
            </div>
          </div>
        );

    }

}

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout

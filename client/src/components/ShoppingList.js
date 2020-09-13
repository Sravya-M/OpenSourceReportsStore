import React, {Component} from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import {CSSTransition, CSSTransitionGroup, TransitionGroup} from 'react-transition-group';
//import {v1 as uuid} from 'uuid'; ////import uuid from 'uuid/dist/v1';
import {connect} from 'react-redux';
import {getItems, deleteItem} from '../actions/ItemActions';
import PropTypes from 'prop-types';
class ShoppingList extends Component {
	// state = {
	// 	items: [
	// 		{id: uuid(), name: 'Milk'},
	// 		{id: uuid(), name: 'Curd'},
	// 		{id: uuid(), name: 'Bread'},
	// 		{id: uuid(), name: 'Veggies'}
	// 	]
	// } // Moved to reducer
	componentDidMount() {
		this.props.getItems();
	}
	onDeleteClick = (id) => {
		this.props.deleteItem(id);
	}
	render() {
		
		const {items} = this.props.item;
		return (
			<Container>
				
				<ListGroup>
					<TransitionGroup className="shopping-list">
						{items.map(({_id, name}) => (
							<CSSTransition key={_id} timeout={500} classNames="fade">
								<ListGroupItem>
									<Button
										className="remove-btn"
										color="danger"
										size="sm"
										onClick={this.onDeleteClick.bind(this, _id)}
									>&times;</Button>
									{name}
								</ListGroupItem>
							</CSSTransition>
						))}
					</TransitionGroup>
				</ListGroup>
			</Container>
		);
	}
}

ShoppingList.propTypes = {
	getItems: PropTypes.func.isRequired,
	item: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	item: state.item
});
export default connect(mapStateToProps, {getItems, deleteItem})(ShoppingList);
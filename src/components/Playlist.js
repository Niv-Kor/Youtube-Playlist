import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import VideoTile from './VideoTile';
import { changeOrderAction } from '../store/actions/index';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => ({
    changeOrder: (oldIndex, newIndex) => dispatch(changeOrderAction({ oldIndex, newIndex }))
});

class Playlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.playlist,
            loaded: false
        }

        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    };

    componentDidUpdate(prevProps) {
        if (prevProps.playlist !== this.props.playlist)
            this.setState({ items: this.props.playlist });
    }

    /**
     * @param {Boolean} isDragged - True of the item is currently being dragged
     * @param {Object} draggableStyle - Default 'react-beautiful-dnd' css style
     * @returns {Object} A css style object.
     */
    getItemStyle(isDragged, draggableStyle) {
        if (isDragged) return {
            userSelect: 'none',
            backgroundColor: '#ff8097',
            transition: 'background-color .2s linear !important',
            ...draggableStyle
        }
        else return {
            userSelect: 'none',
            backgroundColor: '#f0f0f0',
            transition: 'background-color .2s linear !important',
            ...draggableStyle
        }
    };
    
    /**
     * @param {Boolean} isDraggingOver - True if an item is being dragged over the list
     * @returns {Object} A css style object.
     */
    getListStyle(isDraggingOver) {
        return {
            background: isDraggingOver ? "lightblue" : "lightgrey",
        }
    }

    /**
     * Create rectangular video tiles from a raw video data.
     * 
     * @param {Array} data - [
     *                          {
     *                             {String} title - The video's title,
     *                             {String} duration - The video's duration,
     *                             {String} src - Youtube URL
     *                          },
     *                          ...
     *                       ]
     * @returns {Array<JSX>} An array of draggable list items.
     */
    CreateVideoTiles(data) {
        if (!data) return;

        return data.map((item, index) => (
            <Draggable
                key={`key ${index}`}
                draggableId={`id ${index}`}
                index={index}
            >
                {(provided, snapshot) => (
                    <li id={(index === 0) ? 'first-video' : ''}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                        <VideoTile
                            src={item.src}
                            title={this.trimTitle(item.title, 60)}
                            duration={item.duration}
                        />
                    </li>
                )}
            </Draggable>
        ));
    }

    /**
     * Trim the title to a fixed amount of maximum characters,
     * and append '...' as its suffix.
     * 
     * @param {String} str - The title to trim
     * @param {Number} len - Amount of maximum characters
     * @returns {String} The new trimmed title.
     */
    trimTitle(str, len) {
        if (!str || str.length <= len) return str;
        else if (str.length > len) return str.substring(0, len) + '...';
    }

    /**
     * Change the order of a single item in a list.
     * 
     * @param {Array} list - The list to reorder
     * @param {Number} startIndex - The current index of the item
     * @param {Number} endIndex - The next index of the items
     * @returns A duplicated list in which the specified item is reordererd.
     */
    reorderList(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
      
        return result;
    };

    /**
     * Activate when an item in the playlist is dropped.
     * 
     * @param {Object} event - Automatic event parameter
     */
    handleDragEnd(event) {
        if (!event.destination) return;
        
        let source = event.source.index;
        let dest = event.destination.index;

        if (source !== dest) {
            const items = this.reorderList(this.state.items, source, dest);
            this.props.changeOrder(source, dest)
            this.setState({ items: items });
        }
    }

    render() {
        return (
            <div className="playlist-window">
                <DragDropContext onDragEnd={this.handleDragEnd}>
                    <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <ul
                            className="playlist-list"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={this.getListStyle(snapshot.isDraggingOver)}
                        >
                        {this.CreateVideoTiles(this.state.items)}
                        {provided.placeholder}
                        </ul>
                    )}
                    </Droppable>
                </DragDropContext>
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(Playlist);
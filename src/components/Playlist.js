import React, { Component } from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import VideoTile from './VideoTile';
import { addVideo } from '../Socket';

class Playlist extends Component {
    constructor() {
        super();
        this.state = {
            items: this.getItems()
        }

        this.handleDragEnd = this.handleDragEnd.bind(this);
    }

    /**
     * Get the playlist's raw videos data from the server.
     * 
     * @returns {Array} [
     *                     {
     *                        {String} title - The video's title,
     *                        {String} duration - The video's duration,
     *                        {String} src - Youtube URL
     *                     },
     *                     ...
     *                  ]
     */
    getItems() {
        setTimeout(() => addVideo('fdfd video 2'), 2000);

        return [
            {
                title: 'video 0',
                duration: '3:15',
                src: ""
            },
            {
                title: 'video 1',
                duration: '1:51',
                src: ""
            },
            {
                title: 'video 2',
                duration: '2:35',
                src: ""
            },
            {
                title: 'video 3',
                duration: '5:11',
                src: ""
            },
            {
                title: 'video 4',
                duration: '2:09',
                src: ""
            },
            {
                title: 'video 5',
                duration: '6:43',
                src: ""
            },
            {
                title: 'video 6',
                duration: '4:23',
                src: ""
            },
            {
                title: 'video 7',
                duration: '1:12',
                src: ""
            },
            {
                title: 'video 8',
                duration: '0:40',
                src: ""
            }
        ];
    }

    /**
     * @param {Boolean} isDragged - True of the item is currently being dragged
     * @param {Object} draggableStyle - Default 'react-beautiful-dnd' css style
     * @returns {Object} A css style object.
     */
    getItemStyle(isDragged, draggableStyle) {
        if (isDragged) return {
            userSelect: 'none',
            backgroundColor: '#ff133e',
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
        return data.map((item, index) => (
            <Draggable
                key={`key ${index}`}
                draggableId={`id ${index}`}
                index={index}
            >
                {(provided, snapshot) => (
                    <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                        <VideoTile
                            src={item.src}
                            title={item.title}
                            duration={item.duration}
                        />
                    </li>
                )}
            </Draggable>
        ));
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
        
        const items = this.reorderList(
            this.state.items,
            event.source.index,
            event.destination.index
        );

        this.setState({ items: items });
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

export default Playlist;
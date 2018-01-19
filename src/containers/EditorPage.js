import React, {Component} from 'react';
import '../css/EditorPage.css';
import { editEvent, deleteEvent, fetchSingleStory, showError } from '../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Map from '../components/Map';
import EventInfo from '../components/EventInfo';
import TimeLine from '../components/TimeLine';

class EditorPage extends Component {

 state = {
    currentEventIndex: 0,
    showPrev: false,
    showNext: true,
    coordinates: {},
    times: []
  }

 constructor (props) {
    super(props);
    this.props.fetchSingleStory(props.computedMatch.params.storyId);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.story.events && nextProps.story.events.length > 1) this.setState({ showNext:true });
  }

  componentWillMount = () => {
    const times = [];
    this.props.story.events.map(event => {
      times.push(event.startTime)
    })
    this.setState({times})
  }

  newEvent = () => ({
    title: '',
    startTime: '00:00',
    mapLocation: '',
    dateAndTime: '',
    attachments: []
  })

  onEventEdit = (event) => {
    const storyId = this.props.story._id;
    event.coordinates = [this.state.coordinates];
    if (event.title === '') {
      this.props.showError('Please provide a title for your event');
      return;
    }
    if (!event.coordinates[0].lng) {
      this.props.showError('Please provide geo coordinates for your event (click on map)');
      return;
    }
    this.props.editEvent(event, storyId);
    this.props.story.events[this.state.currentEventIndex] = event;
    this.goNext();
  }

 onEventDelete = (eventId) => {
    const storyId = this.props.story._id;
    this.props.deleteEvent(storyId, eventId);
  }

  goNext = () => {
    this.setState({
      showNext: this.props.story.events[this.state.currentEventIndex+1] !== undefined,
      showPrev: true,
      currentEventIndex: this.state.currentEventIndex+1
    })
  }

  goPrev = () => {
    if(this.state.currentEventIndex === 0) return;
    this.setState({
      showNext: true,
      showPrev: this.state.currentEventIndex > 1,
      currentEventIndex: this.state.currentEventIndex-1
    })
  }

  markerAdded = (coordinates) => {
    this.setState({
      coordinates
    })
  }

  renderEventInfo () {
    if(!this.props.story.events || typeof this.props.story.events[0] === 'string') return null;

    const currentEvent = this.props.story.events[this.state.currentEventIndex]
      ? this.props.story.events[this.state.currentEventIndex]
      : this.newEvent();

    return (
      <EventInfo
        event={currentEvent}
        eventIndex={this.state.currentEventIndex}
        totalEvents={this.props.story.events.length}
        onEventEdit={this.onEventEdit}
        onEventDelete={this.onEventDelete}
        showPrev={this.state.showPrev}
        showNext={this.state.showNext}
        goNext={this.goNext}
        goPrev={this.goPrev}
      />
    )
  }

  matched = (match) => {
    this.setState({
      currentEventIndex: this.props.story.events
        .indexOf(this.props.story.events.find(event => match === event.startTime))
    })
  }

  render () {
    const event = this.props.story.events[this.state.currentEventIndex];
    const markersProps = {}
    if (event && event.coordinates && event.coordinates.length > 0) {
      markersProps.markers = event.coordinates;
    }

    return (
      <div className="EditorPage">
        <div className="EventInfoDiv">
          {this.renderEventInfo()}
        </div>
        <div className="MapTimeLine">
          <Map {...markersProps} onMarkerAdded={this.markerAdded} editor />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  story: state.entities.stories[ownProps.computedMatch.params.storyId],
});

const mapDispatchToProps = (dispatch) => ({
  fetchSingleStory: (storyId) => dispatch(fetchSingleStory(storyId)),
  editEvent: (data, storyId) => dispatch(editEvent(data, storyId)),
  deleteEvent: (storyId, eventId) => dispatch(deleteEvent(storyId, eventId)),
  showError: (errorMessage) => dispatch(showError(errorMessage)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditorPage));

import React, {Component} from 'react';
import '../css/Viewer.css';
import { connect } from 'react-redux';
import { fetchSingleStory, showError } from '../actions';
import { Card, CardHeader } from 'material-ui/Card';
import EventCard from '../components/EventCard';
import Map from '../components/Map';
import TimeLine from '../components/TimeLine';

class Viewer extends Component {

  state = {
    time: '',
    currentEventIndex: 0,
  }

  componentWillMount() {
    if (!this.props.match.params.storyId) return null;
    this.props.loadStory(this.props.match.params.storyId);
  }

  renderEvent = (event) => {
    if(!event) return null;
    const { title, dateAndTime } = event;
    const styles = {
      title: {
        fontWeight: 'bold',
      },
      subtitle: {
        fontWeight: 'bold',
        fontStyle: 'italic',
      }
    }
    console.log(title, dateAndTime);
    return (
      <Card className="Titles">
        <CardHeader
          title={title}
          titleStyle={styles.title}
          subtitle={dateAndTime}
          subtitleStyle={styles.subtitle}
        />
      </Card>
    )
  }

  renderAttachments = (attachments) => {
    if(!attachments) return null;
    return attachments.map((attachment, i) => <EventCard key={i} data={{attachments: [attachment]}} expanded />);
  }

  eventTimes =() => {
    let startTimes = []
    const { storyId } = this.props.match.params
    this.props.stories[storyId].events.forEach(story => {
      startTimes.push(story.startTime);
    })
    return startTimes;
  }

  currentStory = () => (this.props.stories[this.props.match.params.storyId]);

  onTimelineChangeEvent = (match) => {
    this.setState({
      currentEventIndex: this.currentStory().events
        .indexOf(this.currentStory().events.find(event => match === event.startTime))
    })
  }

  render() {
    const story = this.currentStory();
    if (!story.events) return null;
    const event = story.events[this.state.currentEventIndex];
    let marker = {};
    if (event && event.location && event.location.lng && event.location.lat) marker = event.location;
    else return null;
    return (
      <div className="Viewer">
        <div className="MapViewer">
          <div className="EventsContainerWrapper">
            <div className="EventsContainer">
              {this.renderEvent(event)}
              {event !== undefined ? this.renderAttachments(event.attachments) : null}
            </div>
          </div>
          <Map marker={marker}/>
        </div>
        <TimeLine events={story.events} match={this.onTimelineChangeEvent} autoplay />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  stories: state.entities.stories,
});

const mapDispatchToProps = (dispatch) => ({
  loadStory: (storyId) => dispatch(fetchSingleStory(storyId)),
  showError: (errorMessage) => dispatch(showError(errorMessage)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);

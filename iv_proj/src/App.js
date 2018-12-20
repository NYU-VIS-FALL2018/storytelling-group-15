import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3-fetch";
import * as moment from "moment";
import ReactCSSTransitionReplace from "react-css-transition-replace";
import AreaChart from "./components/AreaChart";
import MapStates from "./components/MapStates";
import MapLocations from "./components/MapLocations";
import StepSlider from "./components/MapSlider";
import StackedBarChart from "./components/StackedBarChart";
import BarChart from "./components/BarChart";
import BubbleChartRace from "./components/BubbleChart";
import BarChartMentalIllness from "./components/BarChartMentalIllness";
import BubbleChartWeapons from "./components/BubbleChartWeapons";
import bannerImage from "./data/banner.png";
// import "animate.css"
import AOS from "aos";
import "aos/dist/aos.css";
class App extends Component {
  constructor(props) {
    super(props);
    AOS.init({
      duration: 500
    });

    this.state = {
      data: [],
      map: {}
    };
  }
  componentDidMount() {
    this.getCSVData();
    // this.getUSMapData()
  }

  getMapChanger(index) {
    return (
      <StepSlider
        classes={{ root: "root" }}
        value={index}
        changeMap={this.changeMap.bind(this)}
      />
    );
  }

  getMap(value, data) {
    const maps = {
      0: (
        <div key="map_states" className="map_shootings_by_state">
          <MapStates data={data} mapChanger={this.getMapChanger(value)} />
        </div>
      ),
      1: (
        <div key="map_locations" className="map_shootings_by_city">
          <MapLocations data={data} mapChanger={this.getMapChanger(value)} />
        </div>
      )
    };
    return maps[value];
  }

  changeMap(value) {
    this.setState({
      map: this.getMap(value, this.state.data)
    });
  }

  getCSVData() {
    const cleanDatum = datum => {
      datum.Year = moment(datum.Date)
        .utc()
        .year();
      for (let i of Object.keys(datum)) {
        if (typeof datum[i] === "string") {
          datum[i] = datum[i].trim().toLowerCase();
        }
        if (i === "Average Shooter Age") {
          datum[i] = parseInt(Math.round(parseFloat(datum[i]))) || 25;
        } else if (i === "History of Mental Illness - General") {
          const mentalIllnessHistoryTypes = ["yes", "no", "unknown"];
          if (!mentalIllnessHistoryTypes.includes(datum[i])) {
            datum[i] = "unknown";
          }
        } else if (i === "Number of shooters") {
          datum[i] = datum[i] === "" ? "unknown" : datum[i];
        }
        this.objectVals[i] = this.objectVals[i]
          ? this.objectVals[i].add(datum[i])
          : new Set([datum[i]]);
      }
      return datum;
    };
    d3.csv(
      "https://nyu-vis-fall2018.github.io/storytelling-group-15/iv_proj/src/data/Stanford_MSA_cleaned.csv"
    ).then(csvData => {
      this.objectVals = {};
      const data = csvData.map(datum => {
        return cleanDatum(datum);
      });
      this.setState({
        data,
        map: this.getMap(0, data)
      });
    });
  }

  render() {
    return (
      <div className="root">
        <div className="container">
          <div className="containerText">
            <div className="bannerContainer">
              <img src={bannerImage} className="bannerDiv" />

              <div className="headerContainer">
                <h1 style={{ fontSize: "60px", textShadow: "2px 4px white" }}>
                  The Mass Shooting Crisis in the US
                </h1>
                <h2>
                  Is it really a serious problem, or just a continuing trend?
                </h2>
              </div>
            </div>
          </div>
          <div className="quoteContainer">
            <div className="QuoteCss">
              “Firearms are involved in the deaths of more than 30,000 people in
              the US each year”
              <br />{" "}
              <span className="citeCss">
                -Bloomberg Issue Overview: Guns in America
              </span>
            </div>
            <div className="QuoteCss">
              “Guns kill on an average 36 people every day, and the nation
              doesn’t even blink!” <br />
              <span className="citeCss">-The Huffington Post</span>
            </div>
          </div>
          {this.state.data.length > 0 && (
            <div>
              <div className="caption2">
                <br />
                It seems like gun violence has become a staple of everyday news
                reports, each incident more horrifying than the one before. Take
                the Sandy Hook Elementary School shooting, for instance, when a
                lone 20 year-old man took the life of 28, 20 of them children
                less than 8 years old. Or the Las Vegas shooting of October
                2017, when a single shooter armed with multiple firearms gunned
                down 58 people and injured 851 in only 10 minutes. Why did these
                things happen? What weapons are the deadliest, and what pushes
                the perpetrators so far that they commit such a heinous act of
                their own accord? Let's analyze.
              </div>
              <div className="LineChartContainer">
                <div data-aos="fade-right">
                  <AreaChart data={this.state.data} />
                </div>
                <div className="caption">
                  Was gun violence a problem that always plagued the United
                  States? Absolutely not! Up until about 2005, there were only
                  about 4 or 5 cases a year that came up in news reports.
                  However, there seems to have been an incredible spike in the
                  number of incidents since the year 2010. It's quite difficult
                  to determine the causes directly responsible for this, but it
                  seems quite likely that the upward trend will continue.
                </div>
              </div>
              <div className="caption">
                Temporally, the problem seems to have flared up quite recently.
                Let's now take a spatial look at it.
              </div>
              <div className="MapContainer">
                {/* <hr /> */}
                <div data-aos="zoom-in">
                  <ReactCSSTransitionReplace
                    transitionName="cross-fade"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                  >
                    {this.state.map}
                  </ReactCSSTransitionReplace>
                </div>
                <div className="caption2">
                  6.2 out of every 100,000 people in the country are killed by
                  firearms each year. This average can be seen to be justified
                  from the map above. Looking at the number of mass shootings
                  across states in the United States since 1968, it is easy to
                  see that the problem is fairly widespread throughout the
                  country, with California, Florida and Texas leading the pack
                  in the number of victims per 100,000 people since 1968. This
                  is especially striking considering how highly populated these
                  states are.
                  <br />
                  <br />
                  If we look at the distribution of shootings acrss cities (by
                  clicking on the corresponding radio button), we see a
                  suprising picture. Mass shootings seem to be much more
                  concentrated as we move toward the East Coast, especially with
                  cities like Chicago, Illinois and Cleveland, Ohio having seen
                  multiple deadly shootings.
                </div>
              </div>
              <div className="StackBarChart">
                <div data-aos="fade-right">
                  <StackedBarChart data={this.state.data} />
                </div>
                <div className="caption">
                  To understand just how deadly these shootings can be, we
                  visualize the number of people in the top 5 states with the
                  highest number of mass shootings that have been victims of
                  such incidents since 1968. It is saddening to see how many
                  lives have been lost meaninglessly, and it drives home just
                  how serious this issue really is, justifying our calling it a
                  crisis.
                </div>
              </div>
              <div className="caption2">
                But what prompts these people to take such a step? Is it
                psychological, or merely a spontaneous decision? Let's try to
                look at the attributes of the shooters to see if we can find
                some link there.
              </div>
              <div className="BarChart">
                {/* <hr /> */}
                <div data-aos="zoom-in">
                  <BarChart data={this.state.data} />
                </div>
              </div>
              <div class="caption2">
                When we see what age groups are most commonly involved in
                perpetrating mass shootings, it is quite clear that it is most
                often young people who commit these acts. It is surprising to
                note that each shooter between the ages of 20-30 taking almost 9
                lives on average. Another astonishing fact to note here is that
                even teenagers between the ages of 15 to 19 are responsible for
                a major share of the killings. That there were 10 shootings by
                children between the ages of 10-14 only goes to show how easily
                accessible guns are in the United States. This is a big factor
                behind the number of gun violence cases, according to experts.
              </div>
              <div className="BubbleChart">
                <div data-aos="fade-right">
                  <BubbleChartRace data={this.state.data} />
                </div>
                <div className="caption">
                  It's again quite surprising to note that most mass shootings
                  were carried out by White Americans! Although there
                  has been a huge furore recently about banning immigrants of
                  certain religions from entering the country for national
                  security, the data shows exactly the opposite trend.
                </div>
              </div>
              <div className="caption2">
                It is quite amazing to note that the youth of the country has
                largely been responsible for the issue. This, according to
                experts, is majorly because of a lack of proper education and/or
                guidance. But is it just the people to blame? Isn't the
                widespread easy access to military-grade firearms a significant
                contributing factor?
              </div>
              <div className="BubbleWeaponChart">
                <div className="caption">
                  Handguns are the cheapest and most easily available guns in
                  the US market, and the fact that they have been responsible
                  for the most mass shootings by a margin of almost double
                  cannot be a co-incidence. Semi-automatic rifles, like the
                  infamous AR-5, are more expensive but extremely deadly.
                  Shootings carried out using rifles have on an average 6 more
                  deaths than all other weapon types, justifying the recent
                  demand to ban the AR-5 and the bump stocks that make it even
                  more dangerous.
                </div>
                <div data-aos="fade-left">
                  <BubbleChartWeapons data={this.state.data} />
                </div>
              </div>
              <div className="MentalIllness">
                <div data-aos="fade-right">
                  <BarChartMentalIllness data={this.state.data} />
                </div>
                <div className="caption">
                  It is very commonly cited by pro-gun rights activists that the
                  perpetrators of mass shootings are of poor mental health. We
                  decided to fact check their claim, and given the data, it does
                  not seem to hold up at all! Shooters with a known history of
                  mental illness corresponded to less than 1 in 10 shootings. So
                  while it might be advisable to enforce mental health checkups
                  before a person is allowed to purchase a firearm, it might be
                  far from the solution to the problem.
                </div>
              </div>
              <div className="caption2">
                In conclusion, it does not seem that "conventional" methods
                would work to resolve this issue. Ideas like curtailing
                immigration, or allowing guns in schools, or even nominal
                background checks do sound like they might work, but the data
                just doesn't support them.
                <br />
                <br />
                The US has almost more than 90 firearms in civilian possession
                for every 100 people. That ratio is almost 2.5 times the next
                country in the list. Since 1983, 2 out of 3 mass shootings that
                have happened around the world have been in the US. Contrast
                that to Australia, which implemented a strict gun control
                legislation in 1996. It hasn't had a single mass shooting since.
                <br />
                <br />
                Given this observation and quite a few more, it seems that gun
                control is an idea that is almost guaranteed to work, but
                without societal support and political willpower it cannot
                happen. It is high time that this problem be seen as more than
                just that, that we acknowledge it as a <b>CRISIS</b>.
                <br />
                <br />
                <div className="caption2" style={{textAlign: 'center'}}>
                THAT THIS IS NOT NORMAL.
                </div>
                <br />
                <br />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;

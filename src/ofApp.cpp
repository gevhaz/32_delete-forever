#include "ofApp.h"

void ofApp::setup() 
{
	float audioVolume = 0.5;
	float smoothing = 0.9;
	string songPath = "music/delete-forever.mp3";

	vector<int> lims { 5,11,40,512 };
	vector<float> adjs { 0.524587, 0.113462, 0.0529223, 0.0135686 };

	musicPlayer.load(songPath, audioVolume);
	analyzer.setup(audioVolume, smoothing, lims, adjs);
	shader.setup("shaders/shader");

	ofBackground(ofColor::black);
}

void ofApp::update() 
{
	analyzer.analyze();
	shader.update(analyzer.getVols(), 
                  analyzer.getBeats(), 
                  analyzer.getBeatFades(), 
                  analyzer.getCentroid(), 
                  musicPlayer.getTime());
}

void ofApp::draw() { shader.draw(); }

void ofApp::keyPressed(int key) 
{
	musicPlayer.keyPressed(key);
	shader.keyPressed(key);
}

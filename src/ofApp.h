#pragma once

#include "ofMain.h"
#include "ofxMusicVisualizationKit.hpp"

class ofApp : public ofBaseApp {

	public:
		void setup();
		void update();
		void draw();
		void keyPressed(int key);

	private:
		ofxShaderObject shader;
		ofxSoundAnalyzer analyzer;
		ofxMusicPlayer musicPlayer;

		vector<int> lims;
		vector<float> adjs;
};

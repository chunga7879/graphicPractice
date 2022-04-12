# Assignment 1

### Name: Chunga Lee
#### student number: 18848614
#### CWL User name: xhehf77

### Instruction:

###PART1
#### 1. Action using keyboard:
Pressing keyboard <br>
W key : Slide forward armadillo<br>
S key : Slide backward armadillo<br>
A key : Slide left armadillo<br>
D key : Slide right armadillo<br>
Q key : Rotate clockwise armadillo<br>
E key : Rotate counter-clockwise armadillo<br>

#### 2. Color of the sphere:
Use normal attribute of vertex to color with the fragment normal

#### 3. Lighting the Armadillo:
Light from  the orb interact with the armadillo. Lighting up different parts of the armadillo as it is moved.
So, it uses change attribute of the position to in world frame from in object frame. (inverse transpose for normal).

#### 4. Proximity detection
Further color the armadillo fragments green when in close proximity to the sphere.
It is when the distance between orbDistance is less than minDistance(2.0).

###PART2
#### 1. More object: Sun (light with 0xff0000 (red) color)

#### 2. Action using keyboard:
Pressing keyboard <br>
Z key : Sun is on the left side (position)<br>
X key : Sun is on the front side (position)<br>
C key : Sun is on the right side (position)<br>



